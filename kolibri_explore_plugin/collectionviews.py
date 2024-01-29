# Copyright 2022-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import itertools
import logging
import os
import time
from enum import auto
from enum import IntEnum

from django.utils.translation import gettext_lazy as _
from kolibri.core.content.errors import InsufficientStorageSpaceError
from kolibri.core.content.models import ContentNode
from kolibri.core.content.utils.content_manifest import ContentManifest
from kolibri.core.content.utils.content_manifest import (
    ContentManifestParseError,
)
from kolibri.core.content.utils.import_export_content import (
    get_import_export_data,
)
from kolibri.core.tasks.job import State as JobState
from kolibri.core.tasks.main import job_storage
from kolibri.utils import conf
from kolibri.utils.system import get_free_space
from rest_framework.decorators import api_view
from rest_framework.exceptions import APIException
from rest_framework.response import Response

from .jobs import enqueue_next_background_task
from .jobs import enqueue_task
from .jobs import get_applyexternaltags_task
from .jobs import get_channel_metadata
from .jobs import get_remotechannelimport_task
from .jobs import get_remotecontentimport_task
from .jobs import get_remoteimport_task
from .models import BackgroundTask
from .models import CollectionState
from .models import ContentNodeExtras
from .models import ExternalContentTag

logger = logging.getLogger(__name__)

COLLECTION_PATHS = os.path.join(
    os.path.dirname(__file__), "static", "collections"
)
if conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]:
    COLLECTION_PATHS = conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]

# TODO: The collection language is hardcoded here. It should be split
# in the endless-key-collections repo.
COLLECTION_NAMES_EN = [
    "explorer",
    "artist",
    "scientist",
    "inventor",
    "athlete",
    "curious",
    "extras",
]

COLLECTION_NAMES_ES = [
    "spanish",
    "spanish-extras",
]

COLLECTION_NAMES = COLLECTION_NAMES_EN + COLLECTION_NAMES_ES

COLLECTION_SEQUENCES = [1]

PROGRESS_STEPS = {
    "importing": 0.1,
    "downloading": 0.9,
    "completed": 1,
}


class ChannelNotImported(Exception):
    pass


class EndlessKeyCollection(ContentManifest):
    def __init__(self):
        """Extended content manifest for Endless Key

        The EK collections are organized by name and
        sequence. Example: the "artist-0001" collection has name
        "artist" and sequence 1.

        They also add more metadata and set availability according to
        disk space.

        """

        self.state = None
        self.available = None

        self._manifest_data = None

        super().__init__()

    def get_latest_channels(self):
        """Return set of channel id and latest version tuples"""
        return {
            (channel_id, max(self.get_channel_versions(channel_id)))
            for channel_id in self.get_channel_ids()
        }

    def get_extra_channel_ids(self):
        all_channel_ids = _get_channel_ids_for_all_collections(
            self.state.language_id
        )
        return all_channel_ids.difference(self.get_channel_ids())

    def get_latest_extra_channels(self):
        """Return set of extra channel id and latest version tuples"""
        all_channels = _get_latest_channels_for_all_collections(
            self.state.language_id
        )
        return all_channels.difference(self.get_latest_channels())

    def read_from_static_collection(
        self, name, sequence, language_id, validate=False
    ):

        manifest_filename = os.path.join(
            COLLECTION_PATHS, f"{name}-{sequence:04}.json"
        )

        if not os.path.exists(manifest_filename):
            raise ContentManifestParseError(
                f"Collection manifest {manifest_filename} not found"
            )

        super().read(manifest_filename, validate)

        data = self._manifest_data.get("metadata", {})

        self.state, _created = CollectionState.objects.get_or_create(
            name=name,
            sequence=int(sequence),
            defaults={
                "language_id": language_id,
                "is_extra": name.endswith("extras"),
                "title": data.get("title"),
                "subtitle": data.get("subtitle"),
                "description": data.get("description"),
                "required_gigabytes": int(data.get("required_gigabytes", 0)),
            },
        )

        self.persist_install_state()

    def persist_install_state(self):
        self.state.metadata_installed = self.metadata_installed()
        self.state.content_installed = self.content_installed()
        self.state.thumbnails_installed = self.thumbnails_installed()
        self.state.tags_applied = self.tags_applied()
        self.state.save()

    def update_state(self, stage):
        if stage <= DownloadStage.IMPORTING_CHANNELS:
            return

        previous_stage = stage - 1
        if previous_stage == DownloadStage.IMPORTING_CHANNELS:
            self.state.metadata_installed = self.metadata_installed()
        elif previous_stage == DownloadStage.IMPORTING_CONTENT:
            self.state.content_installed = self.content_installed()
        elif previous_stage == DownloadStage.APPLYING_EXTERNAL_TAGS:
            self.state.tags_applied = self.tags_applied()
            self.state.is_current = True
            self.state.save()

    def read_dict(self, manifest_data, validate=False):
        self._manifest_data = manifest_data
        super().read_dict(manifest_data, validate)

    def to_dict(self):
        raise NotImplementedError()

    def set_availability(self, free_space_gb):
        # FIXME using a hardcoded number is silly. Find a way to get
        # the exact weight.
        self.available = self.state.required_gigabytes < free_space_gb

    def get_channels_count(self):
        return len(self.get_channel_ids())

    def is_download_required(self):
        return any(
            itertools.chain(
                self.iter_channelimport_tasks(),
                self.iter_contentimport_tasks(),
                self.iter_contentthumbnail_tasks(),
                self.iter_applyexternaltags_tasks(),
                self.iter_extra_channelimport_tasks(),
            )
        )

    def metadata_installed(self):
        return not any(self.iter_channelimport_tasks())

    def content_installed(self):
        try:
            return not any(self.iter_contentimport_tasks())
        except ChannelNotImported:
            return False

    def thumbnails_installed(self):
        try:
            return not any(self.iter_contentthumbnail_tasks())
        except ChannelNotImported:
            return False

    def tags_applied(self):
        return not any(self.iter_applyexternaltags_tasks())

    def extra_metadata_installed(self):
        return not any(self.iter_extra_channelimport_tasks())

    def iter_channelimport_tasks(self):
        """Return a serializable object to create channelimport tasks

        For all the channels in this content manifest.
        """
        for channel_id, channel_version in self.get_latest_channels():
            metadata = get_channel_metadata(channel_id)
            if metadata and metadata.version >= channel_version:
                logger.debug(
                    f"Skipping channel import task for {channel_id} since "
                    "already present"
                )
                continue
            yield get_remotechannelimport_task(channel_id)

    def iter_extra_channelimport_tasks(self):
        """Return a serializable object to create extra channelimport tasks

        For all channels featured in Endless Key content manifests. In addition
        to the channel metadata, all thumbnails are downloaded.
        """
        for channel_id, channel_version in self.get_latest_extra_channels():
            # Check if the channel metadata and thumbnails are already
            # available.
            metadata = get_channel_metadata(channel_id)
            if metadata and metadata.version >= channel_version:
                # The channel metadata is available. Now check if the thumbnail
                # nodes are already available.
                num_resources, _, _ = get_import_export_data(
                    channel_id,
                    node_ids=[],
                    available=False,
                    all_thumbnails=True,
                )
                if num_resources == 0:
                    logger.debug(
                        f"Skipping extra channel import task for {channel_id} "
                        "since channel metadata and all resources already "
                        "present"
                    )
                    continue

            yield get_remoteimport_task(
                channel_id, node_ids=[], all_thumbnails=True
            )

    def iter_contentimport_tasks(self):
        """Return a serializable object to create contentimport tasks

        For all the channels in this content manifest.
        """
        for channel_id in self.get_channel_ids():
            channel_metadata = get_channel_metadata(channel_id)
            if channel_metadata is None:
                raise ChannelNotImported

            node_ids = list(
                self._get_node_ids_for_channel(channel_metadata, channel_id)
            )

            # Check if the desired nodes are already available.
            num_resources, _, _ = get_import_export_data(
                channel_id,
                node_ids=node_ids,
                available=False,
            )
            if num_resources == 0:
                logger.debug(
                    f"Skipping content import task for {channel_id} "
                    "since all resources already present"
                )
                continue

            yield get_remotecontentimport_task(
                channel_id, channel_metadata.name, node_ids
            )

    def iter_applyexternaltags_tasks(self):
        """Return a serializable object to create applyexternaltags tasks

        As defined in this content manifest metadata.
        """
        data = self._manifest_data.get("metadata", {})
        if "tagged_node_ids" not in data:
            return []

        for tagged in data["tagged_node_ids"]:
            node_id = tagged["node_id"]
            tags = tagged["tags"]

            node = None
            missing_tags = []
            try:
                node = ContentNode.objects.get(id=node_id)
            except ContentNode.DoesNotExist:
                missing_tags = tags
            else:
                for tag_name in tags:
                    try:
                        ContentNodeExtras.objects.get(
                            tags__tag_name=tag_name, content_node=node
                        )
                    except (
                        ExternalContentTag.DoesNotExist,
                        ContentNodeExtras.DoesNotExist,
                    ):
                        missing_tags.append(tag_name)

            if missing_tags:
                yield get_applyexternaltags_task(node_id, missing_tags)

    def iter_contentthumbnail_tasks(self):
        """Return a serializable object to create thumbnail contentimport tasks

        For all the channels in this content manifest.
        """
        for channel_id in self.get_channel_ids():
            # Check if the desired thumbnail nodes are already available.
            num_resources = None
            try:
                num_resources, _, _ = get_import_export_data(
                    channel_id,
                    node_ids=[],
                    available=False,
                    all_thumbnails=True,
                )
            except TypeError:
                raise ChannelNotImported

            if num_resources == 0:
                logger.debug(
                    f"Skipping content thumbnail task for {channel_id} "
                    "since all resources already present"
                )
                continue

            yield get_remotecontentimport_task(
                channel_id, node_ids=[], all_thumbnails=True
            )

    def _get_node_ids_for_channel(self, channel_metadata, channel_id):
        """Get node IDs regardless of the version

        Assumes that the channel has been imported already.

        This is a copy of internal function
        _node_ids_from_content_manifest in
        kolibri.core.content.management.commands.importcontent
        """
        node_ids = set()

        for channel_version in self.get_channel_versions(channel_id):
            if channel_version != channel_metadata.version:
                logger.warning(
                    "Manifest entry for {channel_id} has a different"
                    " version ({manifest_version}) than the installed"
                    " channel ({local_version})".format(
                        channel_id=channel_id,
                        manifest_version=channel_version,
                        local_version=channel_metadata.version,
                    )
                )
            node_ids.update(
                self.get_include_node_ids(channel_id, channel_version)
            )

        return node_ids


class DownloadStage(IntEnum):
    NOT_STARTED = auto()
    IMPORTING_CHANNELS = auto()
    IMPORTING_CONTENT = auto()
    APPLYING_EXTERNAL_TAGS = auto()
    COMPLETED = auto()


class DownloadError(Exception):
    pass


class CollectionDownloadManager:
    def __init__(self):
        self._set_empty_state()

    def _set_empty_state(self):
        self._collection = None
        self._stage = DownloadStage.NOT_STARTED
        self._current_job_id = None
        self._current_task = None
        self._tasks_pending = []
        self._tasks_completed = []
        self._tasks_previously_completed = []
        self._enqueuing_timestamp = None
        self._enqueued_timestamp = None

    def is_state_unset(self):
        return (
            self._stage == DownloadStage.NOT_STARTED
            and self._collection is None
        )

    def start(self, collection, user):
        """Start downloading a collection manifest."""
        if self._stage != DownloadStage.NOT_STARTED:
            raise DownloadError("A download has already started. Can't start")

        self._collection = collection
        self._set_next_stage(user)

    def from_state(self, state):
        """Resume download from a previous state."""
        if self._stage != DownloadStage.NOT_STARTED:
            raise DownloadError("A download has already started. Can't resume")

        collection_name = state["collection_name"]
        collection_sequence = state["collection_sequence"]
        stage_name = state["stage"]

        self._stage = DownloadStage[stage_name]

        self._collection = _collections_by_name_sequence[collection_name][
            collection_sequence
        ]
        self._collection.update_state(self._stage)

        self._current_job_id = state["current_job_id"]
        self._current_task = state["current_task"]
        self._tasks_pending = state["tasks_pending"]
        self._tasks_completed = state["tasks_completed"]
        self._tasks_previously_completed = state["tasks_previously_completed"]

        logger.info(
            f"Download state loaded for collection with "
            f"name={collection_name} sequence={collection_sequence}, "
            f"stage={stage_name}"
        )
        logger.debug(f"Loaded download state: {state}")

    def cancel(self):
        if self._current_job_id is not None:
            job_storage.cancel(self._current_job_id)

        self._set_empty_state()

    def update(self, user, retry=False):
        """Go to the next download step when possible.

        If the current task was completed move to the next task. If
        the current stage was completed move to the next stage.

        Returns True if the state has changed.
        """
        if self._stage == DownloadStage.NOT_STARTED:
            raise DownloadError("Download hasn't started yet. Can't update")

        if self._stage == DownloadStage.COMPLETED:
            return False

        if self._current_task is None:
            # First task of this phase
            self._next_task_or_stage(user)
            return True

        if self._current_job_id is None:
            # Enqueue still in progress
            # FIXME: The download can potentially stall here!
            duration = 0
            if self._enqueuing_timestamp is not None:
                duration = time.time() - self._enqueuing_timestamp
            logger.info(
                f"Enqueue still in progress for task {self._current_task}"
                f" duration: {duration}"
            )
            return False

        job = job_storage.get_job(self._current_job_id)

        if (
            not retry
            and job.state == JobState.FAILED
            and job.exception == InsufficientStorageSpaceError.__name__
        ):
            raise DownloadError(
                _(
                    "Not enough space to download. "
                    "Please free up some space and try again."
                )
            )

        elif job.state in [JobState.CANCELED, JobState.FAILED]:
            # Current job was canceled or failed so it needs to be restarted.
            # FIXME give up after a number of failures.
            old_job_id = self._current_job_id
            self._current_job_id = job_storage.restart_job(
                self._current_job_id
            )
            logger.info(f"Restarted job with ID {old_job_id} as {job}")
            return True
        elif job.state in [
            JobState.PENDING,
            JobState.SCHEDULED,
            JobState.QUEUED,
            JobState.RUNNING,
            JobState.CANCELING,
        ]:
            # Current job hasn't completed yet
            duration = 0
            if self._enqueued_timestamp is not None:
                duration = time.time() - self._enqueued_timestamp
            logger.info(f"Current job {job} still going, duration: {duration}")
            return False

        # Current task was completed
        assert job.state == JobState.COMPLETED
        duration = 0
        if self._enqueued_timestamp is not None:
            duration = time.time() - self._enqueued_timestamp
        logger.info(f"Job {job} completed! duration: {duration}")
        self._tasks_completed.append(self._current_task)
        self._current_task = None
        self._current_job_id = None
        self._next_task_or_stage(user)
        return True

    def get_status(self):
        """Calculate progress and return download status.

        It must be JSON serializable to be sent to the client in a
        HTTP response.
        """

        progress = None
        pending_tasks_number = len(self._tasks_pending)
        current_task_number = len(self._tasks_completed) + (
            1 if self._current_task else 0
        )
        total_tasks_number = current_task_number + pending_tasks_number

        if self._stage == DownloadStage.NOT_STARTED:
            progress = 0

        elif self._stage == DownloadStage.IMPORTING_CHANNELS:
            if total_tasks_number > 0:
                progress = (
                    PROGRESS_STEPS["importing"]
                    * current_task_number
                    / total_tasks_number
                )
            else:
                progress = 0

        elif self._stage == DownloadStage.IMPORTING_CONTENT:
            if self._current_job_id is None:
                progress = PROGRESS_STEPS["importing"]
            else:
                job = job_storage.get_job(self._current_job_id)

                current_job_factor = (
                    0
                    if job.total_progress == 0
                    else job.progress / job.total_progress
                )

                # TODO: ideally weight by channel size:
                progress_per_channel = (
                    PROGRESS_STEPS["downloading"] - PROGRESS_STEPS["importing"]
                ) / total_tasks_number

                progress = (
                    PROGRESS_STEPS["importing"]
                    + progress_per_channel * len(self._tasks_completed)
                    + progress_per_channel * current_job_factor
                )

        elif self._stage == DownloadStage.APPLYING_EXTERNAL_TAGS:
            if total_tasks_number > 0:
                progress = (
                    PROGRESS_STEPS["downloading"]
                    + (
                        PROGRESS_STEPS["completed"]
                        - PROGRESS_STEPS["downloading"]
                    )
                    * current_task_number
                    / total_tasks_number
                )
            else:
                progress = PROGRESS_STEPS["downloading"]

        elif self._stage >= DownloadStage.COMPLETED:
            progress = PROGRESS_STEPS["completed"]

        return {
            "stage": self._stage.name,
            "progress": progress,
        }

    def to_state(self):
        """Create and return a state representation that is JSON serializable.

        The state can be persisted and used in another session to
        regenerate this singleton using the from_state() method.
        """
        collection_name = None
        collection_sequence = None
        if self._collection is not None:
            collection_name = self._collection.state.name
            collection_sequence = self._collection.state.sequence

        state = {
            "collection_name": collection_name,
            "collection_sequence": collection_sequence,
            "stage": self._stage.name,
            "current_job_id": self._current_job_id,
            "current_task": self._current_task,
            "tasks_pending": self._tasks_pending,
            "tasks_completed": self._tasks_completed,
            "tasks_previously_completed": self._tasks_previously_completed,
        }

        return state

    def _next_task_or_stage(self, user):
        if not self._tasks_pending:
            # No more tasks pending in this stage, move to the next one
            self._set_next_stage(user)
        else:
            # Enqueue next pending task
            self._enqueue_current_task(user)

    def _set_next_stage(self, user):
        if self._stage == DownloadStage.COMPLETED:
            return

        tasks = []
        while not tasks and self._stage != DownloadStage.COMPLETED:
            self._stage = DownloadStage(self._stage + 1)
            self._collection.update_state(self._stage)

            if self._stage == DownloadStage.IMPORTING_CHANNELS:
                tasks = self._collection.iter_channelimport_tasks()
            elif self._stage == DownloadStage.IMPORTING_CONTENT:
                tasks = self._collection.iter_contentimport_tasks()
            elif self._stage == DownloadStage.APPLYING_EXTERNAL_TAGS:
                tasks = self._collection.iter_applyexternaltags_tasks()

        if self._stage == DownloadStage.COMPLETED:
            logger.info("Download completed!")

            # Download the manifest content thumbnails and the extra channels
            # in the background.
            thumbnail_tasks = self._collection.iter_contentthumbnail_tasks()
            extra_channel_tasks = (
                self._collection.iter_extra_channelimport_tasks()
            )
            for task in itertools.chain(thumbnail_tasks, extra_channel_tasks):
                BackgroundTask.create_from_task_data(task)
            logger.info("Starting background download tasks")
            enqueue_next_background_task()

        self._tasks_pending = list(tasks)
        self._tasks_previously_completed.extend(self._tasks_completed)
        self._tasks_completed = []
        logger.info(f"Started download stage: {self._stage.name}")

    def _enqueue_current_task(self, user):
        self._current_task = self._tasks_pending.pop(0)

        self._enqueuing_timestamp = time.time()
        self._enqueued_timestamp = None
        logger.info(
            f"Enqueuing task {self._current_task}"
            f" at {self._enqueuing_timestamp}"
        )

        task = self._current_task["task"]
        params = self._current_task["params"]
        self._current_job_id = enqueue_task(task, user, **params)
        self._enqueuing_timestamp = None
        self._enqueued_timestamp = time.time()
        logger.info(f"Enqueued job id {self._current_job_id}")


_collections = []
_collections_by_language_id = {}
_collections_by_name_sequence = {}
_collection_download_manager = None


def _read_content_manifests():
    global _collections
    global _collections_by_name_sequence
    global _collection_download_manager

    _collection_download_manager = CollectionDownloadManager()

    free_space_gb = get_free_space() / 1024**3

    def _create_manifest(name, sequence, language_id):
        manifest = EndlessKeyCollection()
        try:
            # TODO: Validate the manifest files or remove validation
            # https://phabricator.endlessm.com/T34355
            manifest.read_from_static_collection(
                name, sequence, language_id, validate=False
            )
        except ContentManifestParseError as err:
            logger.error(err)
        else:
            manifest.set_availability(free_space_gb)
            _collections.append(manifest)

            _collections_by_language_id.setdefault(language_id, [])
            _collections_by_language_id[language_id].append(manifest)

            _collections_by_name_sequence.setdefault(name, {})
            _collections_by_name_sequence[name][sequence] = manifest

    for name in COLLECTION_NAMES:
        for sequence in COLLECTION_SEQUENCES:
            language_id = None
            if name in COLLECTION_NAMES_EN:
                language_id = "en"
            elif name in COLLECTION_NAMES_ES:
                language_id = "es"
            _create_manifest(name, sequence, language_id)


def ensure_initiated(api_function):
    """Decorator to initiate only once in the first API call."""

    def wrapper(*args, **kwargs):
        if _collection_download_manager is None:
            _read_content_manifests()
        return api_function(*args, **kwargs)

    return wrapper


def _save_state_in_request_session(request):
    new_state = _collection_download_manager.to_state()
    if new_state["stage"] == DownloadStage.NOT_STARTED.name:
        # Not saving an empty state
        return

    logger.info(f"Saving download state: {new_state}")
    request.session["COLLECTIONS_STATE"] = new_state


def _get_collections_info_by_name_sequence(name, sequence):
    if name not in _collections_by_name_sequence:
        return None
    if int(sequence) not in _collections_by_name_sequence[name]:
        return None
    collection = _collections_by_name_sequence[name][int(sequence)]
    return {
        "name": collection.state.name,
        "sequence": collection.state.sequence,
        "title": collection.state.title,
        "subtitle": collection.state.subtitle,
        "description": collection.state.description,
        "required_gigabytes": collection.state.required_gigabytes,
        "available": collection.available,
        "channelsCount": collection.get_channels_count(),
        "isDownloadRequired": collection.is_download_required(),
    }


def _get_channel_ids_for_all_collections(language_id):
    channel_ids = set()
    for collection in _collections_by_language_id[language_id]:
        channel_ids.update(collection.get_channel_ids())
    return channel_ids


def _get_latest_channels_for_all_collections(language_id):
    """Return set of all channel id and latest version tuples"""
    channels = {}
    for collection in _collections_by_language_id[language_id]:
        for channel_id in collection.get_channel_ids():
            version = max(collection.get_channel_versions(channel_id))
            if version > channels.get(channel_id, -1):
                channels[channel_id] = version
    return set(channels.items())


@ensure_initiated
@api_view(["GET"])
def current_collection_exists(request):
    """Return True if one of the collections is current."""
    return Response(CollectionState.current_exists())


@ensure_initiated
@api_view(["GET"])
def get_collection_info(request):
    """Return the collection metadata and availability."""
    name = request.query_params.get("name")
    sequence = request.query_params.get("sequence")
    collection_info = _get_collections_info_by_name_sequence(name, sequence)
    return Response({"collectionInfo": collection_info})


@ensure_initiated
@api_view(["GET"])
def get_all_collections_info(request):
    """Return all the collections metadata and their availability."""
    info = []
    for name in COLLECTION_NAMES:
        collection_info = {
            "name": name,
            "collections": [],
        }
        for sequence in COLLECTION_SEQUENCES:
            collection = _get_collections_info_by_name_sequence(name, sequence)
            if collection is not None:
                collection_info["collections"].append(collection)
        info.append(collection_info)

    return Response({"allCollectionsInfo": info})


@ensure_initiated
@api_view(["GET"])
def get_should_resume(request):
    """Return if there is a saved state that should be resumed."""
    saved_state = request.session.get("COLLECTIONS_STATE")
    name = None
    sequence = None
    if saved_state is not None:
        name = saved_state["collection_name"]
        sequence = saved_state["collection_sequence"]
    should_resume = (
        saved_state is not None
        and saved_state["stage"] != DownloadStage.COMPLETED.name
    )
    return Response(
        {"shouldResume": should_resume, "name": name, "sequence": sequence}
    )


@ensure_initiated
@api_view(["POST"])
def start_download(request):
    """Start downloading a collection.

    Pass the collection name and sequence in the POST data.

    Returns download status.
    """
    name = request.data.get("name")
    sequence = int(request.data.get("sequence"))

    # Validate name and sequence
    if name not in _collections_by_name_sequence:
        raise APIException(f"Name {name} not found in content manifests")
    if sequence not in _collections_by_name_sequence[name]:
        raise APIException(
            f"Sequence {sequence} not found in content manifests"
        )

    collection = _collections_by_name_sequence[name][sequence]

    # Fail if a previous download can be resumed
    saved_state = request.session.get("COLLECTIONS_STATE")
    if saved_state is not None:
        raise APIException("A previous download state was found. Resume it.")

    # Init the download manager and start downloading
    try:
        _collection_download_manager.start(collection, request.user)
        logger.info(f"Download started for name={name} sequence={sequence}")
    except DownloadError as err:
        raise APIException(err)

    # Extend session so it expires two weeks from now
    request.session.set_expiry(1209600)

    # Save state in session
    _save_state_in_request_session(request)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@ensure_initiated
@api_view(["POST"])
def resume_download(request):
    """Resume download from a previous session.

    Returns download status.
    """

    saved_state = request.session.get("COLLECTIONS_STATE")
    if saved_state is None:
        raise APIException("No download state was found. Can't resume.")

    # Init the download manager and start downloading
    try:
        _collection_download_manager.from_state(saved_state)
        name = saved_state["name"]
        sequence = saved_state["sequence"]
        logger.info(f"Download resumed for name={name} sequence={sequence}")
        logger.info(f"Resumed download state: {saved_state}")
    except DownloadError as err:
        raise APIException(err)

    # Extend session so it expires two weeks from now
    request.session.set_expiry(1209600)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@ensure_initiated
@api_view(["POST"])
def update_download(request):
    """Continue downloading current collection.

    Save state when the dowload status changes.

    Returns download status.
    """
    retry = request.data.get("retry") is not None
    try:
        changed = _collection_download_manager.update(
            request.user, retry=retry
        )
        if changed:
            _save_state_in_request_session(request)
    except DownloadError as err:
        raise APIException(err)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@ensure_initiated
@api_view(["DELETE"])
def cancel_download(request):
    """Cancel current download and clear the saved state.

    Note that this doesn't remove the downloaded data yet.

    Returns download status.
    """
    _collection_download_manager.cancel()

    if "COLLECTIONS_STATE" in request.session:
        del request.session["COLLECTIONS_STATE"]

    logger.info("Download cancelled")

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@ensure_initiated
@api_view(["GET"])
def get_download_status(request):
    """Return the download status."""

    saved_state = request.session.get("COLLECTIONS_STATE")
    if (
        _collection_download_manager.is_state_unset()
        and saved_state is not None
    ):
        _collection_download_manager.from_state(saved_state)

    status = _collection_download_manager.get_status()
    return Response({"status": status})
