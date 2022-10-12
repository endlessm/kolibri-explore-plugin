import logging
import os
from enum import auto
from enum import Enum

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
from rest_framework.response import Response


COLLECTION_PATHS = os.path.join(
    os.path.dirname(__file__), "static", "collections"
)
if conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]:
    COLLECTION_PATHS = conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]

# FIXME add collections info here as well
COLLECTION_GRADES = ["primary", "intermediate", "secondary"]
COLLECTION_NAMES = ["small", "large"]


class DownloadStatus(Enum):
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

    def get_initial_download_state_dict(self):
        """Return an initial state dict that can be stored in request.session.

        With pending tasks ready to be executed by the download state
        manager.
        """
        download_state_dict = {
            "grade": self.grade,
            "name": self.name,
            "status": DownloadStatus.IMPORTING_CHANNELS.name,
            "current_job_id": None,
            "tasks_completed": [],
            "tasks_pending": [],
        }

        for channel_id in self.get_channel_ids():
            download_state_dict["tasks_pending"].append(
                {
                    "task": "remotechannelimport",
                    "params": {
                        "channel_id": channel_id,
                    },
                }
            )

        return download_state_dict

    def get_second_download_state_dict(self):
        """Return an second state dict that can be stored in request.session.

        With pending tasks ready to be executed by the download state
        manager.
        """
        download_state_dict = {
            "grade": self.grade,
            "name": self.name,
            "status": DownloadStatus.IMPORTING_CONTENT.name,
            "current_job_id": None,
            "tasks_completed": [],
            "tasks_pending": [],
        }

        for channel_id in self.get_channel_ids():
            download_state_dict["tasks_pending"].append(
                {
                    "task": "remotecontentimport",
                    "params": {
                        "channel_id": channel_id,
                        "node_ids": list(
                            self.get_node_ids_for_channel(channel_id)
                        ),
                        "exclude_node_ids": [],
                    },
                }
            )

        return download_state_dict

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
                logging.warning(
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


class CollectionDownloadManager:
    def __init__(self):
        pass

    def state_from_dict(self, state):
        pass

    def state_to_dict(self):
        state = {}
        return state


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


# FIXME REMOVE
_job_id = None
_job_id_2 = None
_content_manifest = None

_content_manifests = []
_collection_download_manager = None


def _read_content_manifests():
    global _content_manifests

    free_space_gb = get_free_space() / 1024**3

    for grade in COLLECTION_GRADES:
        for name in COLLECTION_NAMES:
            manifest = EndlessKeyContentManifest(grade, name)
            manifest.read(validate=True)
            manifest.set_availability(free_space_gb)
            _content_manifests.append(manifest)


_read_content_manifests()

# FIXME REMOVE
# let user choose: set by the frontend and stored somewhere
_content_manifest = _content_manifests[0]


# FIXME call this when download starts
def _extend_session(request):
    # The session will expire two weeks from now.
    request.session.set_expiry(1209600)


# FIXME REMOVE
def _test_session(request):
    # The session will expire two weeks from now.
    data = request.session.get("COLLECTIONS_STATE")
    logging.debug(f"MANUQ current data: {data}")

    # channel_ids = _content_manifest.get_channel_ids()
    if data is None:
        new_data = _content_manifest.get_initial_download_state_dict()
        logging.debug(f"MANUQ new data: {new_data}")
        request.session["COLLECTIONS_STATE"] = new_data


@api_view(["GET"])
def get_importchannel_status(request):
    # FIXME remove
    _test_session(request)

    logging.debug("MANUQ get_importchannel_status")
    if _job_id is None:
        return Response({"message": "couldn't check"})

    job = job_storage.get_job(_job_id)
    logging.debug(f"MANUQ JOB {job}")
    return Response(
        {
            "message": f"status: {job.state}"
            + f" progress: {job.progress} of {job.total_progress}"
        }
    )


@api_view(["GET"])
def get_importcontent_status(request):
    logging.debug("MANUQ get_importcontent_status")
    if _job_id_2 is None:
        return Response({"message": "couldn't check"})

    job = job_storage.get_job(_job_id_2)
    logging.debug(f"MANUQ JOB {job}")
    return Response(
        {
            "message": f"status: {job.state}"
            + f" progress: {job.progress} of {job.total_progress}"
        }
    )


@api_view(["POST"])
def start_importchannel(request):
    global _job_id
    logging.debug("MANUQ start_importchannel")
    if _content_manifest is None:
        return Response({"message": "couldn't start"})

    channel_ids = _content_manifest.get_channel_ids()

    # FIXME
    channel_ids = list(channel_ids)[:1]

    for channel_id in channel_ids:
        logging.debug(f"MANUQ IMPORTCHANNEL {request.user} - {channel_id}")
        _job_id = _remotechannelimport(request.user, channel_id)
        logging.debug(f"MANUQ STARTED JOB WITH ID {_job_id}")

    return Response({"message": "importchannel started"})


@api_view(["POST"])
def start_importcontent(request):
    global _job_id_2
    logging.debug("MANUQ start_importcontent")
    if _content_manifest is None:
        return Response({"message": "couldn't start"})

    channel_ids = _content_manifest.get_channel_ids()

    # FIXME
    channel_ids = list(channel_ids)[:1]

    for channel_id in channel_ids:
        logging.debug(f"MANUQ IMPORTCONTENT {request.user} - {channel_id}")
        # FIXME print nodes
        # node_ids =
        # _content_manifest.get_include_node_ids(channel_id,
        # channel_version="11")

        node_ids = _content_manifest.get_node_ids_for_channel(channel_id)
        exclude_node_ids = []
        logging.debug(f"MANUQ IMPORTCONTENT {node_ids} - {exclude_node_ids}")
        _job_id_2 = _remotecontentimport(
            request.user,
            channel_id,
            node_ids,
            exclude_node_ids,
        )
        logging.debug(f"MANUQ STARTED JOB WITH ID {_job_id_2}")

    return Response({"message": "importcontent started"})


def _get_content_manifest(grade, name):
    for manifest in _content_manifests:
        if manifest.grade == grade and manifest.name == name:
            return manifest


# KEEP
@api_view(["GET"])
def get_collections_info(request):
    logging.debug("MANUQ get_collections_info")
    info = []
    for grade in COLLECTION_GRADES:
        grade_info = {
            "grade": grade,
            "collections": [],
            # FIXME move grade metadata from frontend to here
        }
        for name in COLLECTION_NAMES:
            manifest = _get_content_manifest(grade, name)
            collection_info = {
                "grade": manifest.grade,
                "name": manifest.name,
                "metadata": manifest.metadata,
                "available": manifest.available,
            }
            grade_info["collections"].append(collection_info)
        info.append(grade_info)

    return Response({"collectionsInfo": info})


@api_view(["POST"])
def start_download(request):
    """Start downloading a collection.

    Pass the collection "grade" and "name" in the POST data.

    Raise error if a download is already happening? Or resume?
    """
    grade = request.data.get("grade")
    name = request.data.get("name")

    logging.debug(f"MANUQ start_download {grade} {name}")

    # init the download manager
    # return the download status

    return Response({"status": "start_download"})


@api_view(["POST"])
def continue_download(request):
    logging.debug("MANUQ continue_download")

    # check if the current job has completed
    # if so call update in the download manager
    # return the download status

    return Response({"status": "continue_download"})


@api_view(["GET"])
def get_download_status(request):
    logging.debug("MANUQ get_download_status")

    # return the download status

    return Response({"status": "get_download_status"})
