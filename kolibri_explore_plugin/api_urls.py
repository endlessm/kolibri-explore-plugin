from django.conf.urls import url

from .collectionviews import cancel_download
from .collectionviews import continue_download
from .collectionviews import get_collections_info
from .collectionviews import get_download_status
from .collectionviews import resume_download
from .collectionviews import start_download
from .views import EndlessKeyCollections  # FIXME remove


urlpatterns = [
    url(
        # FIXME: Remove once the reimplementation is completed
        r"ek-collections/old",
        EndlessKeyCollections.as_view(),
        name="endless_key_collections",
    ),
    url(
        r"ek-collections/get-collections-info",
        get_collections_info,
        name="get_collections_info",
    ),
    url(
        r"ek-collections/start-download",
        start_download,
        name="start_download",
    ),
    url(
        r"ek-collections/resume-download",
        resume_download,
        name="resume_download",
    ),
    url(
        r"ek-collections/continue-download",
        continue_download,
        name="continue_download",
    ),
    url(
        r"ek-collections/cancel-download",
        cancel_download,
        name="cancel_download",
    ),
    url(
        r"ek-collections/get-download-status",
        get_download_status,
        name="get_download_status",
    ),
]
