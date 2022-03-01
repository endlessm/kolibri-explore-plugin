from django.conf import settings
from django.contrib.auth import login
from kolibri.core.auth.models import Facility
from kolibri.core.auth.models import FacilityUser

try:
    from django.utils.deprecation import MiddlewareMixin
except ImportError:
    MiddlewareMixin = object


class AlwaysAuthenticatedMiddleware(MiddlewareMixin):
    def __init__(self, *args, **kwargs):

        self.username = "endless"
        super(AlwaysAuthenticatedMiddleware, self).__init__(*args, **kwargs)

    def process_request(self, request):
        if not request.user.is_authenticated():
            facility = Facility.get_default_facility()
            user, created = FacilityUser.objects.get_or_create(
                username=self.username, facility=facility
            )
            user.backend = settings.AUTHENTICATION_BACKENDS[0]
            login(request, user)
