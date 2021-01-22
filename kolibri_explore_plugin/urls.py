from django.conf.urls import url

from .views import AppBackgroundView
from .views import AppView
from .views import ExploreView

urlpatterns = [
    url(
        r"^app/(?P<app>[\w\-]+)/background",
        AppBackgroundView.as_view(),
        name="app_bg",
    ),
    url(r"^app/(?P<app>[\w\-]+)(?P<path>.*)", AppView.as_view(), name="app"),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
