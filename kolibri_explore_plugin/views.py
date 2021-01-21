from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import os
import zipfile

from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import TemplateView
from django.views.generic.base import View
from kolibri.core.content.api import cache_forever
from kolibri.core.content.decorators import add_security_headers
from kolibri.core.content.views import get_embedded_file
from kolibri.core.decorators import cache_no_user_data


@method_decorator(cache_no_user_data, name="dispatch")
class ExploreView(TemplateView):
    template_name = "explore/explore.html"


class AppView(View):
    @xframe_options_exempt
    @add_security_headers
    def options(self, request, *args, **kwargs):
        """
        Handles OPTIONS requests which may be sent as "preflight CORS" requests
        to check permissions.
        """
        return HttpResponse()

    @cache_forever
    @xframe_options_exempt
    @add_security_headers
    def get(self, request, app, path):
        base = os.path.join(os.path.dirname(__file__), "apps")
        filename = os.path.join(base, app + ".zip")

        if not os.path.exists(filename):
            raise Http404

        if path.startswith("/"):
            path = path[1:]

        with zipfile.ZipFile(filename) as zf:
            response = get_embedded_file(
                request, zf, filename, path, skip_hashi=True
            )

        response["Accept-Ranges"] = "none"

        return response
