from django.conf.urls import url

from .views import AppView
from .views import ExploreView

urlpatterns = [
    url(r"^app/(?P<app>[\w\-]+)(?P<path>.*)", AppView.as_view(), name="app"),
    url(r"^$", ExploreView.as_view(), name="explore"),
]
