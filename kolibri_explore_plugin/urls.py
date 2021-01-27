from django.conf.urls import url

from .views import AppBackgroundView
from .views import AppMetadataView
from .views import AppView
from .views import ExploreView

urlpatterns = [
    url(
        r"^app/(?P<app>[\w\-]+)/background",
        AppBackgroundView.as_view(),
        name="app_bg",
    ),
    url(
        r"^app/(?P<app>[\w\-]+)/metadata.json",
        AppMetadataView.as_view(),
        name="app_metadata",
    ),
    url(r"^app/(?P<app>[\w\-]+)(?P<path>.*)", AppView.as_view(), name="app"),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
