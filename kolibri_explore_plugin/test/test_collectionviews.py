import json
import time
from itertools import product

import pytest
import requests_mock
from django.core.management import call_command
from django.urls import reverse
from kolibri.core.content.models import ChannelMetadata
from kolibri.core.content.models import ContentNode
from kolibri.core.content.models import LocalFile
from kolibri.core.tasks import main as tasks_main
from rest_framework.test import APIClient

from .utils import COLLECTIONSDIR
from .utils import ExploreTestTimeoutError
from .utils import wait_for_background_tasks
from kolibri_explore_plugin import collectionviews
from kolibri_explore_plugin.jobs import TaskType


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
                    "isDownloadRequired": True,
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
                    "isDownloadRequired": True,
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


@pytest.mark.usefixtures("channel_import_db", "worker", "content_server")
@pytest.mark.django_db
@pytest.mark.parametrize(
    ("grade", "name"),
    product(
        collectionviews.COLLECTION_GRADES, collectionviews.COLLECTION_NAMES
    ),
)
def test_download_manager_preload(facility_user, grade, name):
    """Test collections downloads with preloaded content"""
    # Import the channels in full.
    manifest = collectionviews._content_manifests_by_grade_name[grade][name]
    all_channels = set(
        list(manifest.get_channel_ids())
        + list(manifest.get_extra_channel_ids())
    )
    for channel_id in all_channels:
        call_command("importchannel", "network", channel_id)
        call_command("importcontent", "--fail-on-error", "network", channel_id)

    # Keep track of the number of channels and files downloaded. Make
    # sure all channels and files have been downloaded.
    num_initial_channels = ChannelMetadata.objects.count()
    num_initial_files = LocalFile.objects.filter(available=True).count()
    assert num_initial_channels == len(all_channels)
    assert LocalFile.objects.filter(available=False).count() == 0

    # Clear all the jobs to check if any downloading jobs were created
    # later.
    job_storage = tasks_main.job_storage
    job_storage.clear(force=True)

    # Run the downloader with requests blocked. Since no URLs are mocked, all
    # requests will fail. Since the download manager retries tasks forever, it
    # will eventually time out on any request.
    with requests_mock.Mocker():
        manager = collectionviews.CollectionDownloadManager()
        run_download_manager(manager, manifest, facility_user)
        wait_for_background_tasks()

    # Check that no additional channels or files have been downloaded.
    assert ChannelMetadata.objects.count() == num_initial_channels
    assert (
        LocalFile.objects.filter(available=True).count() == num_initial_files
    )

    # Check that no channel or content import jobs were created.
    channel_jobs = job_storage.filter_jobs(func=TaskType.REMOTECHANNELIMPORT)
    assert channel_jobs == []
    content_jobs = job_storage.filter_jobs(func=TaskType.REMOTECONTENTIMPORT)
    assert content_jobs == []
    import_jobs = job_storage.filter_jobs(func=TaskType.REMOTEIMPORT)
    assert import_jobs == []
