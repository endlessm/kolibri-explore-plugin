from django.conf.urls import url

from .views import ExploreView

urlpatterns = [url(r"^$", ExploreView.as_view(), name="explore")]
