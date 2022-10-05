from django.conf.urls import url

from .collectionviews import get_importchannel_status
from .collectionviews import get_importcontent_status
from .collectionviews import start_importchannel
from .collectionviews import start_importcontent
from .views import EndlessKeyCollections

# from .collectionviews import EndlessKeyCollectionsView

urlpatterns = [
    url(
        r"ek-collections/old",
        EndlessKeyCollections.as_view(),
        name="endless_key_collections",
    ),
    # url(
    #     r"ek-collections/new",
    #     EndlessKeyCollectionsView.as_view(),
    #     name="endless_key_collections_new",
    # ),
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
]
