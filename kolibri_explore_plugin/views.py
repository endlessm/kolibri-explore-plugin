from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import json
import os

import requests
from django.http import FileResponse
from django.http import Http404
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView
from django.views.generic.base import View
from kolibri.core.content.api import cache_forever
from kolibri.core.content.api import RemoteChannelViewSet
from kolibri.core.content.zip_wsgi import add_security_headers
from kolibri.core.content.zip_wsgi import get_embedded_file
from kolibri.core.decorators import cache_no_user_data
from kolibri.core.tasks.api import _job_to_response
from kolibri.core.tasks.api import _remoteimport
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import queue
from kolibri.utils import conf
from kolibri.utils.server import get_status


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
    @cache_forever
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


@method_decorator(csrf_exempt, name="dispatch")
class EndlessLearningCollection(View):
    COLLECTION_TOKENS = {
        "small": "totoj-jupak",
        "medium": "totoj-jupak",
        "large": "totoj-jupak",
    }
    BASE_URL = "https://kolibri-content.endlessos.org/"

    def get(self, request):
        job_ids = request.session.get("job_ids", [])
        jobs = [queue.fetch_job(job) for job in job_ids]
        running = [job for job in jobs if job.state == State.RUNNING]
        pid, _, _ = get_status()

        # requeue stalled jobs
        for job in running:
            job_pid = job.extra_metadata.get("PID", None)
            if job_pid and job_pid != pid:
                job.extra_metadata["PID"] = pid
                queue.storage.save_job_meta(job)
                queue.storage._update_job(job.job_id, State.QUEUED)

        finished_states = [
            State.FAILED,
            State.CANCELING,
            State.CANCELED,
        ]

        jobs_response = [
            _job_to_response(job)
            for job in jobs
            if job.state not in finished_states
        ]

        return HttpResponse(
            json.dumps(jobs_response), content_type="application/json"
        )

    def post(self, request):
        collection = "small"
        if request.body:
            data = json.loads(request.body)
            collection = data.get("collection", "small")

        token = self.COLLECTION_TOKENS[collection]

        channel_viewset = RemoteChannelViewSet()
        channels = channel_viewset._make_channel_endpoint_request(
            identifier=token
        )

        job_ids = []

        pid, _, _ = get_status()
        for channel in channels:
            task = {
                "channel_id": channel["id"],
                "channel_name": channel["name"],
                "baseurl": self.BASE_URL,
                "started_by_username": "endless",
                "type": "REMOTEIMPORT",
                "PID": pid,
            }

            job_id = queue.enqueue(
                _remoteimport,
                task["channel_id"],
                task["baseurl"],
                extra_metadata=task,
                track_progress=True,
                cancellable=True,
            )
            job_ids.append(job_id)

        request.session["job_ids"] = job_ids
        return HttpResponse(
            json.dumps(job_ids), content_type="application/json"
        )
