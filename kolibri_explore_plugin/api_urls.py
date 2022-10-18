from django.conf.urls import url

from .collectionviews import cancel_download
from .collectionviews import get_collections_info
from .collectionviews import get_download_status
from .collectionviews import get_should_resume
from .collectionviews import resume_download
from .collectionviews import start_download
from .collectionviews import update_download
from .views import EndlessLearningCollection  # FIXME remove


urlpatterns = [
    url(
        # FIXME: Remove once the reimplementation is completed
        r"ek-collections/old",
        EndlessLearningCollection.as_view(),
        name="endless_learning_collection",
    ),
    url(
        r"ek-collections/get-collections-info",
        get_collections_info,
        name="get_collections_info",
    ),
    url(
        r"ek-collections/get-should-resume",
        get_should_resume,
        name="get_should_resume",
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
        r"ek-collections/update-download",
        update_download,
        name="update_download",
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
