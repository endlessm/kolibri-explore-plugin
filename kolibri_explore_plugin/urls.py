from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from .views import AppBackgroundView
from .views import AppView
from .views import ExploreView
from .views import MatomoView
from .views import MetricsView

urlpatterns = [
    url(
        r"^app/(?P<app>[\w\-]+)/background",
        AppBackgroundView.as_view(),
        name="app_bg",
    ),
    url(r"^app/(?P<app>[\w\-]+)(?P<path>.*)", AppView.as_view(), name="app"),
    url(r"^matomo/matomo.js", MatomoView.as_view(), name="matomo.js"),
    url(
        r"^matomo/matomo.php",
        csrf_exempt(MetricsView.as_view()),
        name="metrics",
    ),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
