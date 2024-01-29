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
        "_collections",
        [],
    )
    monkeypatch.setattr(
        collectionviews,
        "_collections_by_language_id",
        {},
    )
    monkeypatch.setattr(
        collectionviews,
        "_collections_by_name_sequence",
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
    with ContentServer(serverdir) as server:
        # Override the Kolibri content server URL.
        monkeypatch.setitem(
            OPTIONS["Urls"],
            "CENTRAL_CONTENT_BASE_URL",
            server.url,
        )

        yield server


@pytest.fixture
def facility():
    """Create Kolibri facility"""
    from kolibri.core.auth.models import Facility

    return Facility.objects.create(name="facility")


@pytest.fixture
def facility_user(facility):
    """Create Kolibri facility user with manage content permissions"""
    from kolibri.core.auth.models import FacilityUser
    from kolibri.core.device.models import DevicePermissions

    user = FacilityUser.objects.create(username="test", facility=facility)
    user.set_password("test")
    user.save()
    DevicePermissions.objects.create(
        user=user, is_superuser=False, can_manage_content=True
    )
    return user


@pytest.fixture
def channel_import_db(transactional_db, monkeypatch):
    """Database setup for use when importing channels

    Normal django database test usage (like with django's TestCase) uses
    a database transaction that's thrown out at the end of the test.
    Transactional django database test usage (like with django's
    TransactionTestCase) truncates all database tables at the end of the
    test. The preferred method is a database transaction since it's much
    faster.

    However, when performing a channel import, the database is being
    updated with sqlachemy. The sqlalchemy database access won't be part
    of the database transaction and neither it nor the django ORM will
    see each other's activity. Therefore, transactional_db is needed
    whenever the database will be accessed by both django and
    sqlalchemy. Furthermore, sqlalchemy needs to be told to connect
    differently for these tests.
    """
    from kolibri.core.content.test.sqlalchemytesting import (
        django_connection_engine,
    )
    from kolibri.core.content.utils import sqlalchemybridge

    _get_engine = sqlalchemybridge.get_engine

    def get_engine(connection_string):
        if connection_string == sqlalchemybridge.get_default_db_string():
            return django_connection_engine()
        return _get_engine(connection_string)

    monkeypatch.setattr(sqlalchemybridge, "get_engine", get_engine)

    return transactional_db


@pytest.fixture
def worker(tmp_path, monkeypatch):
    """Kolibri tasks worker

    A temporary job storage database is used so that it's automatically
    destroyed at the end of the test.
    """
    from kolibri.core.tasks import api
    from kolibri.core.tasks import main
    from kolibri.core.tasks import registry
    from kolibri.core.tasks.storage import Storage
    from kolibri.core.tasks.utils import db_connection
    from kolibri_explore_plugin import collectionviews
    from kolibri_explore_plugin import jobs

    jobs_db_path = tmp_path / "job_storage.sqlite3"
    monkeypatch.setitem(
        OPTIONS["Tasks"],
        "JOB_STORAGE_FILEPATH",
        str(jobs_db_path),
    )

    connection = db_connection()
    storage = Storage(connection=connection)

    # Override several references to the Kolibri tasks global connection and
    # job_storage objects.
    monkeypatch.setattr(main, "connection", connection)
    monkeypatch.setattr(main, "job_storage", storage)
    monkeypatch.setattr(api, "job_storage", storage)
    monkeypatch.setattr(registry, "job_storage", storage)
    monkeypatch.setattr(collectionviews, "job_storage", storage)
    monkeypatch.setattr(jobs, "job_storage", storage)

    worker = main.initialize_workers()
    try:
        yield
    finally:
        worker.shutdown(wait=True)
        connection.dispose()
