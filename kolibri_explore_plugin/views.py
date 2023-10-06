# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import os

import requests
from django.http import FileResponse
from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control
from django.views.decorators.cache import never_cache
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import TemplateView
from django.views.generic.base import View
from kolibri.core.content.zip_wsgi import add_security_headers
from kolibri.core.content.zip_wsgi import get_embedded_file
from kolibri.core.decorators import cache_no_user_data
from kolibri.utils import conf


APPS_BUNDLE_PATHS = []
if conf.OPTIONS["Explore"]["APPS_BUNDLE_PATH"]:
    APPS_BUNDLE_PATHS.append(conf.OPTIONS["Explore"]["APPS_BUNDLE_PATH"])
APPS_BUNDLE_PATHS.append(os.path.join(os.path.dirname(__file__), "apps"))


@method_decorator(cache_no_user_data, name="dispatch")
class ExploreView(TemplateView):
    template_name = "explore/explore.html"

    def get_context_data(self, *args, **kwargs):
        ctx = super().get_context_data(*args, **kwargs)
        ctx["show_build_info"] = os.environ.get("SHOW_BUILD_INFO", "false")
        return ctx


class AppBase(View):
    @xframe_options_exempt
    def options(self, request, *args, **kwargs):
        """
        Handles OPTIONS requests which may be sent as "preflight CORS" requests
        to check permissions.
        """
        return HttpResponse()

    def _get_file(self, app, path):
        path = path.lstrip("/")

        for apps_bundle_path in APPS_BUNDLE_PATHS:
            filename = os.path.join(apps_bundle_path, app, path)
            if os.path.exists(filename):
                break
        else:
            raise Http404

        return filename


class AppView(AppBase):
    @method_decorator(cache_control(max_age=604800), name="dispatch")
    @xframe_options_exempt
    def get(self, request, app, path=""):
        filename = self._get_file(app, "custom-channel-ui.zip")

        response = get_embedded_file(filename, filename, path)

        response["Accept-Ranges"] = "none"
        add_security_headers(request, response)

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
    def get(self, request, app, filename):
        full_filename = self._get_file(app, filename)
        response = FileResponse(open(full_filename, "rb"))
        add_security_headers(request, response)
        return response


class AppMetadataView(AppBase):
    @xframe_options_exempt
    def get(self, request, app):
        filename = self._get_file(app, "metadata.json")
        with open(filename) as json_file:
            return HttpResponse(json_file, content_type="application/json")
