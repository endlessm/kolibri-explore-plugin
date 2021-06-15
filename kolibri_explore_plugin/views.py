from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import os
import zipfile

import requests
from django.http import FileResponse
from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
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

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx["show_build_info"] = os.environ.get("SHOW_BUILD_INFO", "false")
        return ctx


class AppBase(View):
    @xframe_options_exempt
    @add_security_headers
    def options(self, request, *args, **kwargs):
        """
        Handles OPTIONS requests which may be sent as "preflight CORS" requests
        to check permissions.
        """
        return HttpResponse()

    def _get_file(self, app, path):
        base = os.path.join(os.path.dirname(__file__), "apps")

        if path.startswith("/"):
            path = path[1:]

        filename = os.path.join(base, app, path)
        if not os.path.exists(filename):
            raise Http404

        return filename


class AppView(AppBase):
    @cache_forever
    @xframe_options_exempt
    @add_security_headers
    def get(self, request, app, path=""):
        filename = self._get_file(app, "custom-channel-ui.zip")

        with zipfile.ZipFile(filename) as zf:
            response = get_embedded_file(
                request, zf, filename, path, skip_hashi=True
            )

        response["Accept-Ranges"] = "none"

        return response


class AppViewDev(AppBase):
    BASE_APP = "http://localhost:8080/"

    @never_cache
    def get(self, request, app, path=""):
        response = requests.get(f"{self.BASE_APP}{path}", stream=True)
        return HttpResponse(
            response.content,
            content_type=response.headers["Content-Type"],
        )


class AppFileView(AppBase):
    @xframe_options_exempt
    @add_security_headers
    def get(self, request, app, filename):
        full_filename = self._get_file(app, filename)
        return FileResponse(open(full_filename, "rb"))


class AppMetadataView(AppBase):
    @xframe_options_exempt
    @add_security_headers
    def get(self, request, app):
        filename = self._get_file(app, "metadata.json")
        with open(filename) as json_file:
            return HttpResponse(json_file, content_type="application/json")
