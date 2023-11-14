# Test utilities
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import functools
import json
import logging
import os
import re
import shutil
import threading
import time
from base64 import b64decode
from glob import iglob
from hashlib import md5
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler
from http.server import ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse

from django.db import OperationalError
from kolibri.core.tasks.job import State

from kolibri_explore_plugin.models import BackgroundTask

logger = logging.getLogger(__name__)

TESTDIR = Path(__file__).parent.resolve()
CHANNELSDIR = TESTDIR / "channels"
COLLECTIONSDIR = TESTDIR / "collections"


class ExploreTestError(Exception):
    """Exceptions from kolibri-explore-plugin tests"""

    pass


class ExploreTestTimeoutError(ExploreTestError):
    """Timeout exceptions from kolibri-explore-plugin tests"""

    pass


def create_contentdir(content_path, channels_path=CHANNELSDIR):
    """Create content directory from channel JSON files"""
    from kolibri.core.content.constants.schema_versions import (
        CURRENT_SCHEMA_VERSION,
    )
    from kolibri.core.content.utils.sqlalchemybridge import Bridge

    databases_path = content_path / "databases"
    databases_path.mkdir(parents=True, exist_ok=True)
    storage_path = content_path / "storage"
    storage_path.mkdir(parents=True, exist_ok=True)

    for json_path in iglob(f"{channels_path}/*.json"):
        logger.debug(f"Loading channel JSON {json_path}")
        with open(json_path, "r") as f:
            data = json.load(f)

        channels = data["content_channelmetadata"]
        if len(channels) != 1:
            raise ValueError(
                "Must be one channel in content_channelmetadata table"
            )

        channel_id = channels[0]["id"]

        # For convenience, copy the input JSON file so the data can be
        # introspected without loading a sqlite database.
        db_json_path = databases_path / f"{channel_id}.json"
        logger.debug(f"Creating channel JSON data {db_json_path}")
        shutil.copyfile(json_path, db_json_path)

        db_path = databases_path / f"{channel_id}.sqlite3"
        if db_path.exists():
            logger.debug(f"Removing existing channel database {db_path}")
            db_path.unlink()

        logger.debug(f"Creating channel database {db_path}")
        bridge = Bridge(db_path, schema_version=CURRENT_SCHEMA_VERSION)
        bridge.Base.metadata.bind = bridge.engine
        bridge.Base.metadata.create_all()

        # Create the content files from the localfile _content entries.
        logger.debug(f"Creating channel {channel_id} content files")
        for localfile in data["content_localfile"]:
            id = localfile["id"]
            size = localfile["file_size"]
            ext = localfile["extension"]
            content = b64decode(localfile.pop("_content"))
            content_size = len(content)
            if content_size != size:
                raise ValueError(
                    f"Localfile {id} size {size} does not match "
                    f"content size {content_size}"
                )
            content_md5 = md5(content).hexdigest()
            if content_md5 != id:
                raise ValueError(
                    f"Localfile {id} does not match content md5sum "
                    f"{content_md5}"
                )

            # If the file already exists, validate its contents. Otherwise,
            # create it.
            localfile_dir = storage_path / f"{id[0]}/{id[1]}"
            localfile_dir.mkdir(parents=True, exist_ok=True)
            localfile_path = localfile_dir / f"{id}.{ext}"
            if localfile_path.exists():
                logger.debug(f"Validating content file {localfile_path}")
                localfile_size = os.path.getsize(localfile_path)
                if localfile_size != size:
                    raise ValueError(
                        f"Localfile {id} size {size} does not match "
                        f"{localfile_path} size {localfile_size}"
                    )
                with open(localfile_path, "rb") as f:
                    localfile_content = f.read()
                if localfile_content != content:
                    raise ValueError(
                        f"Localfile {id} content does not match "
                        f"{localfile_path} content"
                    )
            else:
                logger.debug(f"Creating content file {localfile_path}")
                with open(localfile_path, "wb") as f:
                    f.write(content)

        # Now fill all the database tables.
        for table in bridge.Base.metadata.sorted_tables:
            if data.get(table.name):
                bridge.connection.execute(table.insert(), data[table.name])

        bridge.end()


def wait_for_background_tasks(timeout=30):
    """Wait for background tasks to complete with a timeout

    Raises ExploreTestTimeoutError if they haven't completed in timeout
    seconds.
    """
    deadline = time.monotonic() + timeout
    while True:
        # The storage hook is run from the worker, which is in a separate
        # thread. Since it accesses the BackgroundTask table, this code is
        # attempting to access the table concurrently. Occasionally that will
        # throw an OperationalError because sqlite locks the table in each
        # connection. Ignore that and carry on.
        try:
            incomplete_jobs = BackgroundTask.objects.exclude(
                job_state=State.COMPLETED
            )
            num_incomplete_jobs = len(incomplete_jobs)
        except OperationalError:
            logger.exception("Could not query incomplete background tasks")
            time.sleep(0.5)
            continue

        if num_incomplete_jobs == 0:
            logger.debug("All background tasks competed")
            return

        if time.monotonic() >= deadline:
            raise ExploreTestTimeoutError(
                f"Background tasks did not complete within {timeout} seconds"
            )
        logger.debug(
            f"Waiting for incomplete background tasks: {incomplete_jobs}"
        )
        time.sleep(0.5)


class ContentHTTPRequestHandler(SimpleHTTPRequestHandler):
    """HTTP request handler for Kolibri content server"""

    # Kolibri tries to access the raw socket in some scenarios, and that's not
    # possible with HTTP/1.0 since the socket is closed immediately after the
    # response is sent.
    protocol_version = "HTTP/1.1"

    # A list of path regex and handler tuples for routing requests.
    ROUTES = [
        (re.compile(r"^/api/public/info/$"), "_send_device_info"),
        (
            re.compile(
                r"^/api/public/v1/channels/lookup/(?P<channel_id>[^/]+)$"
            ),
            "_send_channel_lookup",
        ),
    ]

    def send_head(self):
        url_parts = urlparse(self.path)
        for regex, handler in self.ROUTES:
            match = regex.match(url_parts.path)
            if not match:
                continue
            func = getattr(self, handler)
            return func(match)

        return super().send_head()

    def _send_device_info(self, match):
        """Send server device information

        See kolibri.core.device.utils.get_device_info.
        """
        from kolibri import __version__ as kolibri_version

        data = {
            "application": "studio",
            "kolibri_version": kolibri_version,
            "instance_id": "952d412212d549eb9b73a86f426d8a49",
            "device_name": "Test Studio",
            "operating_system": None,
        }
        content = json.dumps(data).encode("utf-8")

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        return BytesIO(content)

    def _send_channel_lookup(self, match):
        """Send channel information

        See kolibri.core.public.api.get_public_channel_lookup,
        kolibri.core.content.serializers.PublicChannelSerializer,
        kolibri.core.content.base_models.ChannelMetadata and
        kolibri.core.content.models.ChannelMetadata.
        """
        channel_id = match.group("channel_id")
        channel = self._get_channel_data(channel_id)

        if channel:
            metadata = channel["content_channelmetadata"][0]
            root_node = next(
                node
                for node in channel["content_contentnode"]
                if node["id"] == metadata["root_id"]
            )
            root_lang_id = root_node.get("lang_id")
            if root_lang_id:
                root_lang = next(
                    lang
                    for lang in channel["content_language"]
                    if lang["id"] == root_lang_id
                )
                root_lang_code = root_lang["lang_code"]
            else:
                root_lang_code = None

            included_languages = [
                lang["id"] for lang in channel.get("content_language", [])
            ]
            total_resource_count = len(
                [
                    node
                    for node in channel["content_contentnode"]
                    if node["kind"] != "topic"
                ]
            )
            published_size = sum(
                [f["file_size"] for f in channel["content_localfile"]]
            )

            data = [
                {
                    "id": metadata["id"],
                    "name": metadata["name"],
                    "language": root_lang_code,
                    "included_languages": included_languages,
                    "description": metadata.get("description", ""),
                    "tagline": metadata.get("tagline", None),
                    "total_resource_count": total_resource_count,
                    "version": metadata["version"],
                    "published_size": published_size,
                    "last_published": metadata.get("last_updated"),
                    "icon_encoding": metadata.get("thumbnail", ""),
                    "matching_tokens": [],
                    "public": True,
                },
            ]
            status = HTTPStatus.OK
        else:
            data = {
                "id": "NOT_FOUND",
                "metadata": {"view": ""},
            }
            status = HTTPStatus.NOT_FOUND

        content = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        return BytesIO(content)

    def _get_channel_data(self, channel_id):
        json_path = os.path.join(
            self.directory,
            f"content/databases/{channel_id}.json",
        )
        try:
            with open(json_path) as f:
                return json.load(f)
        except FileNotFoundError:
            return None

    def log_message(self, format, *args):
        logger.debug(
            "%s - - [%s] %s",
            self.address_string(),
            self.log_date_time_string(),
            format % args,
        )


class ContentServer:
    """Content HTTP server"""

    def __init__(self, path):
        self.path = Path(path)
        self.server = None
        self.thread = None
        self.address = None
        self.url = None

        if not self.path.is_dir():
            raise ValueError(f"{path} is not a directory")

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.stop()

    def _run_server(self):
        self.server.serve_forever()

    def start(self):
        """Start the HTTP server

        A separate thread is used so that the HTTP server can block.
        """
        handler_class = functools.partial(
            ContentHTTPRequestHandler,
            directory=self.path,
        )
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), handler_class)
        self.address = self.server.server_address
        self.url = f"http://{self.address[0]}:{self.address[1]}"

        self.thread = threading.Thread(target=self._run_server, daemon=True)
        self.thread.start()
        if not self.thread.is_alive():
            raise ExploreTestError(f"HTTP thread {self.thread.name} exited")
        logger.debug(
            f"Serving {self.path} on {self.url} from thread {self.thread.name}"
        )

    def stop(self):
        """Stop the HTTP server"""
        if self.server is not None:
            if self.thread is not None:
                if self.thread.is_alive():
                    logger.debug(
                        f"Stopping HTTP server thread {self.thread.name}"
                    )
                    self.server.shutdown()
                self.thread = None

            self.server.server_close()
            self.server = None
