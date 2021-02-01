from django.conf.urls import url

from .views import AppFileView
from .views import AppMetadataView
from .views import AppView
from .views import ExploreView

urlpatterns = [
    url(
        r"^app/static/(?P<app>[\w\-]+)/(?P<filename>[\w\-.]+)",
        AppFileView.as_view(),
        name="app_file",
    ),
    url(
        r"^app/(?P<app>[\w\-]+)/metadata.json",
        AppMetadataView.as_view(),
        name="app_metadata",
    ),
    url(r"^app/(?P<app>[\w\-]+)(?P<path>.*)", AppView.as_view(), name="app"),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
