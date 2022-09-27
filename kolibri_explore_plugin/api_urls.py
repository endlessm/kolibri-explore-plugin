from django.conf.urls import url

from .views import EndlessKeyCollections
from .views import EndlessKeyCollectionsView

urlpatterns = [
    url(
        r"^endless-key-collections/?",
        EndlessKeyCollections.as_view(),
        name="endless_key_collections",
    ),
    url(
        r"^endless-key-collections-new/?",
        EndlessKeyCollectionsView.as_view(),
        name="endless_key_collections_new",
    ),
]
