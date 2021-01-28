import os

from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from . import __version__ as VERSION
from .views import AppFileView
from .views import AppMetadataView
from .views import ExploreView
from .views import MatomoView
from .views import MetricsView

if os.environ.get("PROXY_CUSTOM_CHANNEL", None):
    from .views import AppViewDev as AppView
else:
    from .views import AppView

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
    url(r"^matomo/matomo.js", MatomoView.as_view(), name="matomo.js"),
    url(
        r"^matomo/matomo.php",
        csrf_exempt(MetricsView.as_view()),
        name="metrics",
    ),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
