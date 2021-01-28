from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import os
import threading
import urllib.parse
import zipfile

from django.http import FileResponse
from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.generic.base import TemplateView
from django.views.generic.base import View
from http import client
from kolibri.core.content.api import cache_forever
from kolibri.core.content.decorators import add_security_headers
from kolibri.core.content.views import get_embedded_file
from kolibri.core.decorators import cache_no_user_data

from .models import MatomoRequest


@method_decorator(cache_no_user_data, name="dispatch")
class ExploreView(TemplateView):
    template_name = "explore/explore.html"


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
    def get(self, request, app, path):
        filename = self._get_file(app, "custom-channel-ui.zip")

        if path.startswith("/"):
            path = path[1:]

        with zipfile.ZipFile(filename) as zf:
            response = get_embedded_file(
                request, zf, filename, path, skip_hashi=True
            )

        response["Accept-Ranges"] = "none"

        return response


class AppBackgroundView(AppBase):
    @xframe_options_exempt
    @add_security_headers
    def get(self, request, app):
        filename = self._get_file(app, "background.jpg")
        return FileResponse(open(filename, "rb"))


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
        req = MatomoRequest()
        req.data = urllib.parse.urlencode(request.GET)
        req.user_agent = request.META.get("HTTP_USER_AGENT", "")
        req.save()

        if not self.lock.locked():
            thread = threading.Thread(target=self.dequeue)
            thread.start()

    def post(self, request):
        self.queue(request)
        return HttpResponse()


class MatomoView(View):
    def get(self, request):
        filename = os.path.join(os.path.dirname(__file__), "matomo.js")
        return FileResponse(open(filename, "rb"))
