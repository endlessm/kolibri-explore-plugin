from django.conf.urls import include
from django.conf.urls import url
from rest_framework import routers

from .viewsets import CustomContentNodeSearchViewset
from .viewsets import CustomContentNodeViewset

router = routers.SimpleRouter()
router.register(
    r"customcontentnode",
    CustomContentNodeViewset,
    base_name="customcontentnode",
)
router.register(
    r"customcontentnodesearch",
    CustomContentNodeSearchViewset,
    base_name="customcontentnodesearch",
)

urlpatterns = [url(r"^", include(router.urls))]
