from django.conf.urls import url

from . import __version__ as VERSION
from .views import AppFileView
from .views import AppMetadataView
from .views import AppView
from .views import ExploreView

urlpatterns = [
    url(
        r"^app/%s/static/(?P<app>[\w\-]+)/(?P<filename>[\w\-.]+)" % VERSION,
        AppFileView.as_view(),
        name="app_file",
    ),
    url(
        r"^app/%s/(?P<app>[\w\-]+)/metadata.json" % VERSION,
        AppMetadataView.as_view(),
        name="app_metadata",
    ),
    url(
        r"^app/%s/(?P<app>[\w\-]+)/(?P<path>.*)?" % VERSION,
        AppView.as_view(),
        name="app_custom_presentation",
    ),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
