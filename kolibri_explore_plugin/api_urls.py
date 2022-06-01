from django.conf.urls import url

from .views import EndlessLearningCollection


urlpatterns = [
    url(
        r"^endlesslearning/?",
        EndlessLearningCollection.as_view(),
        name="endless_learning_collection",
    ),
]
