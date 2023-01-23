from django.conf.urls import include
from django.conf.urls import url
from rest_framework import routers

from .collectionviews import cancel_download
from .collectionviews import get_collections_info
from .collectionviews import get_download_status
from .collectionviews import get_should_resume
from .collectionviews import resume_download
from .collectionviews import start_download
from .collectionviews import update_download
from .viewsets import ContentNodeExtrasViewset
from .viewsets import ExternalContentTagViewset


router = routers.SimpleRouter()

router.register(
    r"externalcontenttag",
    ExternalContentTagViewset,
    basename="externalcontenttag",
)
router.register(
    r"contentnodeextras",
    ContentNodeExtrasViewset,
    basename="contentnodeextras",
)

urlpatterns = [
    url(r"^", include(router.urls)),
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
