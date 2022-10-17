import logging
import os
from enum import auto
from enum import IntEnum

from kolibri.core.content.models import ChannelMetadata
from kolibri.core.content.tasks import remotechannelimport
from kolibri.core.content.tasks import remotecontentimport
from kolibri.core.content.utils.content_manifest import ContentManifest
from kolibri.core.content.utils.content_manifest import (
    ContentManifestParseError,
)
from kolibri.core.tasks.main import job_storage
from kolibri.utils import conf
from kolibri.utils.system import get_free_space
from rest_framework.decorators import api_view
from rest_framework.exceptions import APIException
from rest_framework.response import Response


logger = logging.getLogger(__name__)

COLLECTION_PATHS = os.path.join(
    os.path.dirname(__file__), "static", "collections"
)
if conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]:
    COLLECTION_PATHS = conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]

COLLECTION_GRADES = ["primary", "intermediate", "secondary"]
COLLECTION_NAMES = ["small", "large"]

# FIXME: Move this metadata to the collections repo.
GRADES_METADATA = {
    "primary": {
        "title": "for students ages 6-9",
        "subtitle": "(in grades K-3)",
    },
    "intermediate": {
        "title": "for students ages 10-13",
        "subtitle": "(in grades 4-7)",
    },
    "secondary": {
        "title": "for students ages 14+",
        "subtitle": "(in grades 8+)",
    },
}


class DownloadStage(IntEnum):
    NOT_STARTED = auto()
    IMPORTING_CHANNELS = auto()
    IMPORTING_CONTENT = auto()
    COMPLETED = auto()


class EndlessKeyContentManifest(ContentManifest):
    def __init__(self, grade, name):
        """The EK collections are organized by grade. Example: the
        "primary-small" collection has grade "primary" and name
        "small"
        """
        self.grade = grade
        self.name = name
        self.metadata = None
        self.available = None
        super().__init__()

    def read(self, validate=False):
        manifest_filename = os.path.join(
            COLLECTION_PATHS, f"{self.grade}-{self.name}.json"
        )

        if not os.path.exists(manifest_filename):
            raise ContentManifestParseError(
                f"Collection manifest {manifest_filename} not found"
            )

        super().read(manifest_filename, validate)

    def read_dict(self, manifest_data, validate=False):
        self.metadata = manifest_data.get("metadata")
        if self.metadata is None:
            raise ContentManifestParseError(
                "metadata is a required field for Endless Key manifest"
            )
        super().read_dict(manifest_data, validate)

    def set_availability(self, free_space_gb):
        # FIXME using a hardcoded number is silly. Find a way to get
        # the exact weight.
        if "required_gigabytes" in self.metadata:
            self.available = (
                self.metadata["required_gigabytes"] < free_space_gb
            )
        else:
            self.available = False

    def get_channelimport_tasks(self):
        """Return a serializable object to create channelimport tasks

        For all the channels in this content manifest.
        """
        tasks = []

        for channel_id in self.get_channel_ids():
            tasks.append(
                {
                    "task": "remotechannelimport",
                    "params": {
                        "channel_id": channel_id,
                    },
                }
            )

        return tasks

    def get_contentimport_tasks(self):
        """Return a serializable object to create contentimport tasks

        For all the channels in this content manifest.
        """
        tasks = []

        for channel_id in self.get_channel_ids():
            tasks.append(
                {
                    "task": "remotecontentimport",
                    "params": {
                        "channel_id": channel_id,
                        # FIXME
                        "node_ids": [1, 2, 3],
                        # "node_ids": list(
                        #     self.get_node_ids_for_channel(channel_id)
                        # ),
                        "exclude_node_ids": [],
                    },
                }
            )

        return tasks

    def get_node_ids_for_channel(self, channel_id):
        """Get node IDs regardless of the version

        Assumes that the channel has been imported already.

        This is a copy of internal function
        _node_ids_from_content_manifest in
        kolibri.core.content.management.commands.importcontent
        """
        node_ids = set()

        channel_metadata = ChannelMetadata.objects.get(id=channel_id)

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


class DownloadError(Exception):
    pass


class CollectionDownloadManager:
    def __init__(self):
        self._set_empty_state()

    def _set_empty_state(self):
        self._content_manifest = None
        self._stage = DownloadStage.NOT_STARTED
        self._current_job_id = None
        self._current_task = None
        self._tasks_pending = []
        self._tasks_completed = []

    def from_manifest(self, manifest):
        """Start downloading a collection manifest."""
        if self._stage != DownloadStage.NOT_STARTED:
            raise DownloadError("A download has already started. Can't start")

        self._content_manifest = manifest
        self._set_next_stage()

    def from_state(self, state):
        """Resume download from a previous state."""
        if self._stage != DownloadStage.NOT_STARTED:
            raise DownloadError("A download has already started. Can't resume")

        grade = state["grade"]
        name = state["name"]
        stage_name = state["stage"]

        self._content_manifest = _content_manifests_by_grade_name[grade][name]
        self._stage = DownloadStage[stage_name]
        self._current_job_id = state["current_job_id"]
        self._current_task = state["current_task"]
        self._tasks_pending = state["tasks_pending"]
        self._tasks_completed = state["tasks_completed"]

    def cancel(self):
        if self._current_job_id is not None:
            pass
            # FIXME cancel current job
            # job = job_storage.get_job(self._current_job_id)
            # job.SOMETHING

        self._set_empty_state()

    def update(self):
        """Go to the next download step when possible.

        If the current task was completed move to the next task. If
        the current stage was completed move to the next stage.

        Returns True if the state has changed.
        """
        if self._stage == DownloadStage.NOT_STARTED:
            raise DownloadError("Download hasn't started yet. Can't update")

        if self._current_task is None:
            # First task of this phase
            self._enqueue_current_task()
            return True

        if not self._has_current_job_completed():
            return False

        # Current task was completed
        self._tasks_completed.append(self._current_task)
        self._current_task = None
        self._current_job_id = None
        if not self._tasks_pending:
            # No more tasks pending in this stage, move to the next one
            self._set_next_stage()
        else:
            # Enqueue next pending task
            self._enqueue_current_task()
        return True

    def get_status(self):
        """Calculate progress and return download status.

        It must be JSON serializable to be sent to the client in a
        HTTP response.
        """

        # FIXME add more details of current channel being downloaded
        # (name and icon) when possible

        progress = None
        pending = len(self._tasks_pending)
        completed = len(self._tasks_completed)
        total = completed + pending + (1 if self._current_task else 0)

        if self._stage == DownloadStage.NOT_STARTED:
            progress = 0

        elif self._stage == DownloadStage.IMPORTING_CHANNELS:
            progress = completed / total

        elif self._stage == DownloadStage.IMPORTING_CONTENT:
            if self._current_job_id is None:
                progress = 0
            # FIXME
            print(job_storage)
            progress = 0.5
            # job = job_storage.get_job(self._current_job_id)
            # return job.progress / job.total_progress

        elif self._stage == DownloadStage.COMPLETED:
            progress = 1

        return {
            "stage": self._stage.name,
            "progress": progress,
            "completed": completed,
            "total": total,
        }

    def to_state(self):
        """Create and return a state representation that is JSON serializable.

        The state can be persisted and used in another session to
        regenerate this singleton using the from_state() method.
        """
        grade = None
        name = None
        if self._content_manifest is not None:
            grade = self._content_manifest.grade
            name = self._content_manifest.name

        state = {
            "grade": grade,
            "name": name,
            "stage": self._stage.name,
            "current_job_id": self._current_job_id,
            "current_task": self._current_task,
            "tasks_pending": self._tasks_pending,
            "tasks_completed": self._tasks_completed,
        }

        return state

    def _set_next_stage(self):
        if self._stage == DownloadStage.COMPLETED:
            return

        self._stage = DownloadStage(self._stage + 1)

        tasks = []
        if self._stage == DownloadStage.IMPORTING_CHANNELS:
            tasks = self._content_manifest.get_channelimport_tasks()
        elif self._stage == DownloadStage.IMPORTING_CONTENT:
            tasks = self._content_manifest.get_contentimport_tasks()
        self._tasks_pending = tasks
        self._tasks_completed = []

        # Call update so the first task gets enqueued
        if self._stage != DownloadStage.COMPLETED:
            self.update()

    def _has_current_job_completed(self):
        # FIXME what about stalled jobs? cancelled jobs? failed jobs?
        # FIXME use self._current_job_id
        return True

    def _enqueue_current_task(self):
        self._current_task = self._tasks_pending.pop(0)
        self._current_job_id = 123
        # FIXME pass user
        # FIXME call with current task params
        # self._current_job_id = _remotechannelimport(request.user, channel_id)


def _remotechannelimport(user, channel_id):
    """Create, validate and enqueue a remotechannelimport job."""
    channel_metadata = ChannelMetadata.objects.get(id=channel_id)
    job = remotechannelimport.validate_job_data(
        user,
        {
            "channel_id": channel_id,
            "channel_name": channel_metadata.name,
        },
    )
    job_id = remotechannelimport.enqueue(job=job)
    return job_id


def _remotecontentimport(user, channel_id, node_ids, exclude_node_ids):
    """Create, validate and enqueue a remotecontentimport job."""
    job = remotecontentimport.validate_job_data(
        user,
        {
            "channel_id": channel_id,
            # FIXME: Why is channel_name needed? It isn't known at this point.
            "channel_name": "foo",
            "node_ids": node_ids,
            "exclude_node_ids": exclude_node_ids,
        },
    )
    job_id = remotecontentimport.enqueue(job=job)
    return job_id


_content_manifests = []
_content_manifests_by_grade_name = {}
_collection_download_manager = CollectionDownloadManager()


def _read_content_manifests():
    global _content_manifests
    global _content_manifests_by_grade_name

    free_space_gb = get_free_space() / 1024**3

    for grade in COLLECTION_GRADES:
        for name in COLLECTION_NAMES:
            manifest = EndlessKeyContentManifest(grade, name)
            manifest.read(validate=True)
            manifest.set_availability(free_space_gb)
            _content_manifests.append(manifest)

            if grade not in _content_manifests_by_grade_name:
                _content_manifests_by_grade_name[grade] = {}
            _content_manifests_by_grade_name[grade][name] = manifest


_read_content_manifests()

# # FIXME REMOVE
# # let user choose: set by the frontend and stored somewhere
# _content_manifest = _content_manifests[0]


# # FIXME call this when download starts


# @api_view(["GET"])
# def get_importchannel_status(request):
#     logger.debug("MANUQ get_importchannel_status")
#     if _job_id is None:
#         return Response({"message": "couldn't check"})

#     job = job_storage.get_job(_job_id)
#     logger.debug(f"MANUQ JOB {job}")
#     return Response(
#         {
#             "message": f"status: {job.state}"
#             + f" progress: {job.progress} of {job.total_progress}"
#         }
#     )


# @api_view(["GET"])
# def get_importcontent_status(request):
#     logger.debug("MANUQ get_importcontent_status")
#     if _job_id_2 is None:
#         return Response({"message": "couldn't check"})

#     job = job_storage.get_job(_job_id_2)
#     logger.debug(f"MANUQ JOB {job}")
#     return Response(
#         {
#             "message": f"status: {job.state}"
#             + f" progress: {job.progress} of {job.total_progress}"
#         }
#     )


# @api_view(["POST"])
# def start_importchannel(request):
#     global _job_id
#     logger.debug("MANUQ start_importchannel")
#     if _content_manifest is None:
#         return Response({"message": "couldn't start"})

#     channel_ids = _content_manifest.get_channel_ids()

#     # FIXME
#     channel_ids = list(channel_ids)[:1]

#     for channel_id in channel_ids:
#         logger.debug(f"MANUQ IMPORTCHANNEL {request.user} - {channel_id}")
#         _job_id = _remotechannelimport(request.user, channel_id)
#         logger.debug(f"MANUQ STARTED JOB WITH ID {_job_id}")

#     return Response({"message": "importchannel started"})


# @api_view(["POST"])
# def start_importcontent(request):
#     global _job_id_2
#     logger.debug("MANUQ start_importcontent")
#     if _content_manifest is None:
#         return Response({"message": "couldn't start"})

#     channel_ids = _content_manifest.get_channel_ids()

#     # FIXME
#     channel_ids = list(channel_ids)[:1]

#     for channel_id in channel_ids:
#         logger.debug(f"MANUQ IMPORTCONTENT {request.user} - {channel_id}")
#         # FIXME print nodes
#         # node_ids =
#         # _content_manifest.get_include_node_ids(channel_id,
#         # channel_version="11")

#         node_ids = _content_manifest.get_node_ids_for_channel(channel_id)
#         exclude_node_ids = []
#         logger.debug(f"MANUQ IMPORTCONTENT {node_ids} - {exclude_node_ids}")
#         _job_id_2 = _remotecontentimport(
#             request.user,
#             channel_id,
#             node_ids,
#             exclude_node_ids,
#         )
#         logger.debug(f"MANUQ STARTED JOB WITH ID {_job_id_2}")

#     return Response({"message": "importcontent started"})


def _save_state_in_request_session(request):
    new_state = _collection_download_manager.to_state()
    if new_state["stage"] == DownloadStage.NOT_STARTED:
        # Not saving an empty state
        return

    logger.info(f"Saving download state: {new_state}")
    request.session["COLLECTIONS_STATE"] = new_state


@api_view(["GET"])
def get_collections_info(request):
    """Return the collections and their availability."""
    info = []
    for grade in COLLECTION_GRADES:
        grade_info = {
            "grade": grade,
            "collections": [],
            "metadata": GRADES_METADATA[grade],
        }
        for name in COLLECTION_NAMES:
            manifest = _content_manifests_by_grade_name[grade][name]
            collection_info = {
                "grade": manifest.grade,
                "name": manifest.name,
                "metadata": manifest.metadata,
                "available": manifest.available,
            }
            grade_info["collections"].append(collection_info)
        info.append(grade_info)

    return Response({"collectionsInfo": info})


@api_view(["GET"])
def get_should_resume(request):
    """Return if there is a saved state that should be resumed."""
    has_saved_state = "COLLECTIONS_STATE" in request.session
    return Response({"shouldResume": has_saved_state})


@api_view(["POST"])
def start_download(request):
    """Start downloading a collection.

    Pass the collection "grade" and "name" in the POST data.

    Raise error if a download is already happening? Or resume?

    Returns download status.
    """
    grade = request.data.get("grade")
    name = request.data.get("name")

    # Validate grade and name
    if grade not in _content_manifests_by_grade_name:
        raise APIException(f"Grade {grade} not found in content manifests")
    if name not in _content_manifests_by_grade_name[grade]:
        raise APIException(f"Name {name} not found in content manifests")

    manifest = _content_manifests_by_grade_name[grade][name]

    # Fail if a previous download can be resumed
    saved_state = request.session.get("COLLECTIONS_STATE")
    if saved_state is not None:
        raise APIException("A previous download state was found. Resume it.")

    # Init the download manager and start downloading
    try:
        _collection_download_manager.from_manifest(manifest)
        logger.info(f"Download started for {grade=} {name=}")
    except DownloadError as err:
        raise APIException(err)

    # Extend session so it expires two weeks from now
    request.session.set_expiry(1209600)

    # Save state in session
    _save_state_in_request_session(request)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@api_view(["POST"])
def resume_download(request):
    """Resume download from a previous session.

    Raise error if a download is already happening? Or resume?

    Returns download status.
    """

    saved_state = request.session.get("COLLECTIONS_STATE")
    if saved_state is None:
        raise APIException("No download state was found. Can't resume.")

    # Init the download manager and start downloading
    try:
        _collection_download_manager.from_state(saved_state)
        grade = saved_state["grade"]
        name = saved_state["name"]
        logger.info(f"Download resumed for {grade=} {name=}")
    except DownloadError as err:
        raise APIException(err)

    # Extend session so it expires two weeks from now
    request.session.set_expiry(1209600)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@api_view(["POST"])
def continue_download(request):
    """Continue downloading current collection

    Returns download status.
    """
    try:
        changed = _collection_download_manager.update()
        if changed:
            _save_state_in_request_session(request)
    except DownloadError as err:
        raise APIException(err)

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@api_view(["DELETE"])
def cancel_download(request):
    """Cancel current download and clear the saved state

    Note that this doesn't remove the downloaded data yet.

    Returns download status.
    """
    _collection_download_manager.cancel()

    if "COLLECTIONS_STATE" in request.session:
        del request.session["COLLECTIONS_STATE"]

    logger.info("Download cancelled")

    status = _collection_download_manager.get_status()
    return Response({"status": status})


@api_view(["GET"])
def get_download_status(request):
    """Return the download status."""
    status = _collection_download_manager.get_status()
    return Response({"status": status})
