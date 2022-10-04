from django.conf.urls import url

from .collectionviews import EndlessKeyCollectionsView
from .collectionviews import get_foo
from .views import EndlessKeyCollections

urlpatterns = [
    url(
        r"ek-collections/old",
        EndlessKeyCollections.as_view(),
        name="endless_key_collections",
    ),
    url(
        r"ek-collections/new",
        EndlessKeyCollectionsView.as_view(),
        name="endless_key_collections_new",
    ),
    url(
        r"ek-collections/get_foo",
        get_foo,
        name="get_foo",
    ),
]
