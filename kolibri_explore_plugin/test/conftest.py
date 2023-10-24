# pytest fixtures
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import pytest
from django.core.management import call_command
from kolibri.utils.conf import OPTIONS

from .utils import COLLECTIONSDIR
from .utils import ContentServer
from .utils import create_contentdir


@pytest.fixture(autouse=True)
def kolibri_options(monkeypatch):
    """Set Kolibri options for testing"""
    monkeypatch.setitem(
        OPTIONS["Explore"],
        "CONTENT_COLLECTIONS_PATH",
        str(COLLECTIONSDIR),
    )

    # collectionviews has a bunch of global singletons that need to be reset
    # per test.
    from kolibri_explore_plugin import collectionviews

    monkeypatch.setattr(
        collectionviews,
        "COLLECTION_PATHS",
        str(COLLECTIONSDIR),
    )
    monkeypatch.setattr(
        collectionviews,
        "_content_manifests",
        [],
    )
    monkeypatch.setattr(
        collectionviews,
        "_content_manifests_by_language",
        {},
    )
    monkeypatch.setattr(
        collectionviews,
        "_content_manifests_by_grade_name",
        {},
    )
    monkeypatch.setattr(
        collectionviews,
        "_collection_download_manager",
        collectionviews.CollectionDownloadManager(),
    )

    # Re-read the collections.
    collectionviews._read_content_manifests()


@pytest.fixture
def content_data(db):
    """Load test content database fixture"""
    call_command("loaddata", "test-content.json")


@pytest.fixture(scope="session")
def serverdir(tmp_path_factory):
    """Session scoped server root directory"""
    return tmp_path_factory.mktemp("server")


@pytest.fixture(scope="session")
def contentdir(serverdir):
    """Session scoped server content directory"""
    contentdir = serverdir / "content"
    create_contentdir(contentdir)
    return contentdir


@pytest.fixture
def content_server(serverdir, contentdir, monkeypatch):
    """HTTP content server using test data"""
    from kolibri.core.discovery.utils.network.client import NetworkClient
    from kolibri.core.content.utils import resource_import

    with ContentServer(serverdir) as server:
        # Override the Kolibri content server URL.
        monkeypatch.setitem(
            OPTIONS["Urls"],
            "CENTRAL_CONTENT_BASE_URL",
            server.url,
        )

        # Don't introspect the server for info.
        monkeypatch.setattr(
            NetworkClient,
            "build_for_address",
            lambda addr: NetworkClient(addr),
        )
        monkeypatch.setattr(
            resource_import,
            "lookup_channel_listing_status",
            lambda channel_id, baseurl: None,
        )

        yield server
