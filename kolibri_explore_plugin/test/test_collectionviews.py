import json
import time
from itertools import product

import pytest
from django.urls import reverse
from kolibri.core.content.models import ChannelMetadata
from kolibri.core.content.models import ContentNode
from rest_framework.test import APIClient

from .utils import COLLECTIONSDIR
from .utils import ExploreTestTimeoutError
from .utils import wait_for_background_tasks
from kolibri_explore_plugin import collectionviews


@pytest.mark.django_db
def test_get_collection_info():
    url = reverse("kolibri:kolibri_explore_plugin:get_collection_info")
    client = APIClient()

    # Unspecified or missing grade/name results in null info.
    for grade, name in (
        (None, None),
        ("foo", None),
        (None, "foo"),
        ("foo", "bar"),
    ):
        params = {}
        if grade:
            params["grade"] = grade
        if name:
            params["name"] = name
        resp = client.get(url, params)
        assert resp.status_code == 200
        assert resp.json() == {"collectionInfo": None}

    # Test each supported collection.
    for grade in collectionviews.COLLECTION_GRADES:
        for name in collectionviews.COLLECTION_NAMES:
            collection_path = COLLECTIONSDIR / f"{grade}-{name}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            expected_data = {
                "collectionInfo": {
                    "grade": grade,
                    "name": name,
                    "metadata": collection_data["metadata"],
                    "available": True,
                    "channelsCount": len(collection_data["channels"]),
                }
            }

            resp = client.get(url, {"grade": grade, "name": name})
            assert resp.status_code == 200
            assert resp.json() == expected_data


@pytest.mark.django_db
def test_get_all_collections_info():
    url = reverse("kolibri:kolibri_explore_plugin:get_all_collections_info")
    client = APIClient()

    all_collections_info = []
    for grade in collectionviews.COLLECTION_GRADES:
        grade_info = {"grade": grade, "collections": []}
        all_collections_info.append(grade_info)
        for name in collectionviews.COLLECTION_NAMES:
            collection_path = COLLECTIONSDIR / f"{grade}-{name}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            grade_info["collections"].append(
                {
                    "grade": grade,
                    "name": name,
                    "metadata": collection_data["metadata"],
                    "available": True,
                    "channelsCount": len(collection_data["channels"]),
                }
            )
    expected_data = {"allCollectionsInfo": all_collections_info}

    resp = client.get(url)
    assert resp.status_code == 200
    assert resp.json() == expected_data


@pytest.mark.django_db
def test_get_should_resume():
    url = reverse("kolibri:kolibri_explore_plugin:get_should_resume")
    client = APIClient()
    session = client.session

    # With no existing state.
    current_state = None
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {"shouldResume": False, "grade": None, "name": None}

    # Intermediate state.
    current_state = {
        "grade": "artist",
        "name": "0001",
        "stage": collectionviews.DownloadStage.IMPORTING_CONTENT.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": True,
        "grade": "artist",
        "name": "0001",
    }

    # Completed state.
    current_state = {
        "grade": "artist",
        "name": "0001",
        "stage": collectionviews.DownloadStage.COMPLETED.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": False,
        "grade": "artist",
        "name": "0001",
    }


def run_download_manager(manager, manifest, user, timeout=30):
    """Update the download manager until it completes

    Raises ExploreTestTimeoutError if it hasn't completed in timeout seconds.
    """
    manager.start(manifest, user)
    deadline = time.monotonic() + timeout
    while True:
        manager.update(user)
        status = manager.get_status()
        if status["stage"] == collectionviews.DownloadStage.COMPLETED.name:
            return

        if time.monotonic() >= deadline:
            raise ExploreTestTimeoutError(
                f"Download manager did not complete within {timeout} seconds"
            )
        time.sleep(0.5)


# Kolibri's task worker seems to hang occasionally, causing the download tasks
# to never complete. Retry twice on timeouts.
@pytest.mark.flaky(reruns=2, only_rerun="ExploreTestTimeoutError")
@pytest.mark.usefixtures("channel_import_db", "worker", "content_server")
@pytest.mark.django_db
@pytest.mark.parametrize(
    ("grade", "name"),
    product(
        collectionviews.COLLECTION_GRADES, collectionviews.COLLECTION_NAMES
    ),
)
def test_download_manager_clean(facility_user, grade, name):
    """Test collections downloads from no content state"""
    manifest = collectionviews._content_manifests_by_grade_name[grade][name]
    manager = collectionviews.CollectionDownloadManager()

    # Run the download manager and then wait for the background download tasks
    # to complete.
    run_download_manager(manager, manifest, facility_user)
    wait_for_background_tasks()

    # Check that the correct number of channels, nodes and tags are present.
    # Each pack has 2 channels with 2 included nodes each. Each channel has 6
    # nodes. The included nodes from each channel end up downloading 4 nodes -
    # root topic, video, subtopic and document. So, each pack will have 8
    # available nodes. The extra packs don't cause any nodes to become
    # available since only the thumbnails are downloaded.
    assert manifest.language in ("en", "es")
    if manifest.language == "en":
        num_packs = len(collectionviews.COLLECTION_GRADES_EN)
    elif manifest.language == "es":
        num_packs = len(collectionviews.COLLECTION_GRADES_ES)
    assert ChannelMetadata.objects.count() == 2 * num_packs
    assert ContentNode.objects.filter().count() == 12 * num_packs
    assert ContentNode.objects.filter(available=True).count() == 8
