from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import os
import threading
import urllib.parse
import zipfile
from http import client

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

from .models import MatomoRequest


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


class MetricsView(View):
    lock = threading.Lock()

    def matomo_request(self, req):
        """
        Real request to the matomo server
        """

        matomo = "https://endlessos.matomo.cloud"
        url = urllib.parse.urlparse(matomo)
        connection = client.HTTPConnection
        if url.scheme == "https":
            connection = client.HTTPSConnection

        conn = connection(url.hostname, url.port)
        path = "/matomo.php?" + req.data
        headers = {"User-Agent": req.user_agent}
        conn.request("POST", path, headers=headers)

        try:
            response = conn.getresponse()
        except ConnectionError:
            return False

        if response.status != 200 and response.status != 204:
            return False

        return True

    def dequeue(self):
        self.lock.acquire()

        requests = MatomoRequest.objects.filter(sent=False)
        for req in requests:
            if not self.matomo_request(req):
                break
            req.sent = True
            req.save()

        self.lock.release()

    def queue(self, request):
        # limit the number of requests to store in DB
        self.check_db_limits()

        req = MatomoRequest()
        req.data = urllib.parse.urlencode(request.GET)
        req.user_agent = request.META.get("HTTP_USER_AGENT", "")
        req.save()

        if not self.lock.locked():
            thread = threading.Thread(target=self.dequeue)
            thread.start()

    def check_db_limits(self):
        MAX_REQUESTS_IN_QUEUE = 1_000_000
        REMOVE_SIZE = 1000

        MatomoRequest.objects.filter(sent=True).delete()
        if MatomoRequest.objects.count() < MAX_REQUESTS_IN_QUEUE:
            return

        # remove the older requests
        to_remove = MatomoRequest.objects.all()
        to_remove = to_remove.values_list("id", flat=True)
        to_remove = to_remove[:REMOVE_SIZE]
        MatomoRequest.objects.filter(pk__in=to_remove).delete()

    def post(self, request):
        self.queue(request)
        return HttpResponse()


class MatomoView(View):
    def get(self, request):
        filename = os.path.join(os.path.dirname(__file__), "matomo.js")
        return FileResponse(open(filename, "rb"))
