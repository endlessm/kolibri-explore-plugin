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

    # Unspecified or missing name/sequence results in null info.
    for name, sequence in (
        (None, None),
        ("foo", None),
        (None, 999),
        ("foo", 999),
    ):
        params = {}
        if name:
            params["name"] = name
        if sequence:
            params["sequence"] = sequence
        resp = client.get(url, params)
        assert resp.status_code == 200
        assert resp.json() == {"collectionInfo": None}

    # Test each supported collection.
    for name in collectionviews.COLLECTION_NAMES:
        for sequence in collectionviews.COLLECTION_SEQUENCES:
            collection_path = COLLECTIONSDIR / f"{name}-{sequence:04}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            expected_data = {
                "collectionInfo": {
                    "name": name,
                    "sequence": sequence,
                    "title": collection_data["metadata"]["title"],
                    "subtitle": collection_data["metadata"]["subtitle"],
                    "description": collection_data["metadata"]["description"],
                    "required_gigabytes": collection_data["metadata"][
                        "required_gigabytes"
                    ],
                    "available": True,
                    "channelsCount": len(collection_data["channels"]),
                    "isDownloadRequired": True,
                }
            }

            resp = client.get(url, {"name": name, "sequence": sequence})
            assert resp.status_code == 200
            assert resp.json() == expected_data


@pytest.mark.django_db
def test_get_all_collections_info():
    url = reverse("kolibri:kolibri_explore_plugin:get_all_collections_info")
    client = APIClient()

    all_collections_info = []
    for name in collectionviews.COLLECTION_NAMES:
        collection_info = {"name": name, "collections": []}
        all_collections_info.append(collection_info)
        for sequence in collectionviews.COLLECTION_SEQUENCES:
            collection_path = COLLECTIONSDIR / f"{name}-{sequence:04}.json"
            with collection_path.open("r") as f:
                collection_data = json.load(f)
            collection_info["collections"].append(
                {
                    "name": name,
                    "sequence": sequence,
                    "title": collection_data["metadata"]["title"],
                    "subtitle": collection_data["metadata"]["subtitle"],
                    "description": collection_data["metadata"]["description"],
                    "required_gigabytes": collection_data["metadata"][
                        "required_gigabytes"
                    ],
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
    assert resp.json() == {
        "shouldResume": False,
        "name": None,
        "sequence": None,
    }

    # Intermediate state.
    current_state = {
        "collection_name": "artist",
        "collection_sequence": 1,
        "stage": collectionviews.DownloadStage.IMPORTING_CONTENT.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": True,
        "name": "artist",
        "sequence": 1,
    }

    # Completed state.
    current_state = {
        "collection_name": "artist",
        "collection_sequence": 1,
        "stage": collectionviews.DownloadStage.COMPLETED.name,
    }
    session["COLLECTIONS_STATE"] = current_state
    session.save()
    state = session.get("COLLECTIONS_STATE")
    assert state == current_state
    resp = client.get(url)
    assert resp.json() == {
        "shouldResume": False,
        "name": "artist",
        "sequence": 1,
    }


def run_download_manager(manager, collection, user, timeout=30):
    """Update the download manager until it completes

    Raises ExploreTestTimeoutError if it hasn't completed in timeout seconds.
    """
    manager.start(collection, user)
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
    ("name", "sequence"),
    product(
        collectionviews.COLLECTION_NAMES, collectionviews.COLLECTION_SEQUENCES
    ),
)
def test_download_manager_clean(facility_user, name, sequence):
    """Test collections downloads from no content state"""
    collection = collectionviews._collections_by_name_sequence[name][sequence]
    manager = collectionviews.CollectionDownloadManager()

    # Run the download manager and then wait for the background download tasks
    # to complete.
    run_download_manager(manager, collection, facility_user)
    wait_for_background_tasks()

    # Check that the correct number of channels, nodes and tags are present.
    # Each pack has 2 channels with 2 included nodes each. Each channel has 6
    # nodes. The included nodes from each channel end up downloading 4 nodes -
    # root topic, video, subtopic and document. So, each pack will have 8
    # available nodes. The extra packs don't cause any nodes to become
    # available since only the thumbnails are downloaded.
    assert collection.state.language_id in ("en", "es")
    if collection.state.language_id == "en":
        num_packs = len(collectionviews.COLLECTION_NAMES_EN)
    elif collection.state.language_id == "es":
        num_packs = len(collectionviews.COLLECTION_NAMES_ES)
    assert ChannelMetadata.objects.count() == 2 * num_packs
    assert ContentNode.objects.filter().count() == 12 * num_packs
    assert ContentNode.objects.filter(available=True).count() == 8


@pytest.mark.usefixtures("channel_import_db", "worker", "content_server")
@pytest.mark.django_db
@pytest.mark.parametrize(
    ("name", "sequence"),
    product(
        collectionviews.COLLECTION_NAMES, collectionviews.COLLECTION_SEQUENCES
    ),
)
def test_download_manager_preload(facility_user, name, sequence):
    """Test collections downloads with preloaded content"""
    # Import the channels in full.
    collection = collectionviews._collections_by_name_sequence[name][sequence]
    all_channels = set(
        list(collection.get_channel_ids())
        + list(collection.get_extra_channel_ids())
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
        run_download_manager(manager, collection, facility_user)
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
