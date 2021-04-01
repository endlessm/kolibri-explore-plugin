from django.conf.urls import include
from django.conf.urls import url
from rest_framework import routers

from .viewsets import CustomContentNodeViewset

router = routers.SimpleRouter()
router.register(
    r"customcontentnode",
    CustomContentNodeViewset,
    base_name="customcontentnode",
)

urlpatterns = [url(r"^", include(router.urls))]
