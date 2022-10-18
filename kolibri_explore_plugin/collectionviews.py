import logging
import os

from kolibri.core.content.utils.content_manifest import ContentManifest
from kolibri.core.content.utils.content_manifest import (
    ContentManifestParseError,
)
from kolibri.utils import conf
from kolibri.utils.system import get_free_space
from rest_framework.decorators import api_view
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


_content_manifests = []
_content_manifests_by_grade_name = {}


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
    # FIXME implement
    return Response({"shouldResume": True})


@api_view(["POST"])
def start_download(request):
    """Start downloading a collection.

    Pass the collection "grade" and "name" in the POST data.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["POST"])
def resume_download(request):
    """Resume download from a previous session.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["POST"])
def update_download(request):
    """Continue downloading current collection.

    Save state when the dowload status changes.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["DELETE"])
def cancel_download(request):
    """Cancel current download and clear the saved state.

    Returns download status.
    """
    # FIXME implement
    return Response({"status": {}})


@api_view(["GET"])
def get_download_status(request):
    """Return the download status."""
    # FIXME implement
    return Response({"status": {}})
