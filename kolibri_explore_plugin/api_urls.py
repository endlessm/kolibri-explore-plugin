from django.conf.urls import url

from .collectionviews import continue_download
from .collectionviews import get_collections_info
from .collectionviews import get_download_status
from .collectionviews import get_importchannel_status  # FIXME REMOVE
from .collectionviews import get_importcontent_status  # FIXME REMOVE
from .collectionviews import start_download
from .collectionviews import start_importchannel  # FIXME REMOVE
from .collectionviews import start_importcontent  # FIXME REMOVE
from .views import EndlessKeyCollections

# FIXME REMOVE
# FIXME KEEP


urlpatterns = [
    # FIXME: Remove once the reimplementation is completed
    url(
        r"ek-collections/old",
        EndlessKeyCollections.as_view(),
        name="endless_key_collections",
    ),
    # FIXME REMOVE
    url(
        r"ek-collections/start-importchannel",
        start_importchannel,
        name="start_importchannel",
    ),
    url(
        r"ek-collections/get-importchannel-status",
        get_importchannel_status,
        name="get_importchannel_status",
    ),
    url(
        r"ek-collections/start-importcontent",
        start_importcontent,
        name="start_importcontent",
    ),
    url(
        r"ek-collections/get-importcontent-status",
        get_importcontent_status,
        name="get_importcontent_status",
    ),
    # FIXME KEEP
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
        r"ek-collections/continue-download",
        continue_download,
        name="continue_download",
    ),
    url(
        r"ek-collections/get-download-status",
        get_download_status,
        name="get_download_status",
    ),
]
