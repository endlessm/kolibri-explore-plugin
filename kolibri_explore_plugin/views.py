from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import json
import logging
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
from kolibri.core.content.api import metadata_cache
from kolibri.core.content.api import RemoteChannelViewSet
from kolibri.core.content.tasks import remoteimport
from kolibri.core.content.zip_wsgi import add_security_headers
from kolibri.core.content.zip_wsgi import get_embedded_file
from kolibri.core.decorators import cache_no_user_data
from kolibri.core.tasks.exceptions import JobNotFound
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import job_storage
from kolibri.utils import conf
from kolibri.utils.server import _read_pid_file
from kolibri.utils.server import PID_FILE
from kolibri.utils.system import get_free_space


APPS_BUNDLE_PATHS = []
if conf.OPTIONS["Explore"]["APPS_BUNDLE_PATH"]:
    APPS_BUNDLE_PATHS.append(conf.OPTIONS["Explore"]["APPS_BUNDLE_PATH"])
APPS_BUNDLE_PATHS.append(os.path.join(os.path.dirname(__file__), "apps"))


COLLECTION_PATHS = os.path.join(
    os.path.dirname(__file__), "static", "collections"
)
if conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]:
    COLLECTION_PATHS = conf.OPTIONS["Explore"]["CONTENT_COLLECTIONS_PATH"]


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
    @method_decorator(metadata_cache, name="dispatch")
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
class EndlessKeyCollections(View):
    grade_collections = {
        "primary": {
            "small": {
                "available": True,
            },
            "large": {
                "available": True,
            },
        },
        "intermediate": {
            "small": {
                "available": True,
            },
            "large": {
                "available": True,
            },
        },
        "secondary": {
            "small": {
                "available": True,
            },
            "large": {
                "available": True,
            },
        },
    }

    def _job_to_response(self, job):
        output = {
            "status": job.state,
            "type": job.func,
            "exception": job.exception,
            "traceback": job.traceback,
            "percentage": job.percentage_progress,
            "id": job.job_id,
            "cancellable": job.cancellable,
            "clearable": job.state
            in [State.FAILED, State.CANCELED, State.COMPLETED],
            "facility_id": job.facility_id,
            "extra_metadata": job.extra_metadata,
            "channel_name": job.extra_metadata.get("channel_name", ""),
        }
        return output

    def update_collection_from_json(self):
        free_space_gb = get_free_space() / 1024**3
        for grade, collections in self.grade_collections.items():
            for name, collection in collections.items():
                # content_manifest = EndlessKeyContentManifest()
                manifest_filename = os.path.join(
                    COLLECTION_PATHS, f"{grade}-{name}.json"
                )

                if not os.path.exists(manifest_filename):
                    logging.error("Collection manifest not found")
                    collection["loaded"] = False
                    continue

                # content_manifest.read(manifest_filename, validate=True)
                # content_manifest.set_availability(free_space_gb)
                # FIXME
                # collection["manifest"] = content_manifest
                with open(manifest_filename) as fd:
                    manifest_data = json.load(fd)
                    collection["loaded"] = True
                    collection["channels"] = manifest_data.get("channels", [])
                    collection["metadata"] = manifest_data.get("metadata", {})

                # check collection availability
                if "required_gigabytes" in collection["metadata"]:
                    collection["available"] = (
                        collection["metadata"]["required_gigabytes"]
                        < free_space_gb
                    )
                else:
                    collection["available"] = False

    def get(self, request):
        job_ids = request.session.get("job_ids", [])
        try:
            jobs = [job_storage.get_job(job) for job in job_ids]
        except JobNotFound:
            request.session["job_ids"] = []
            jobs = []
        running = [job for job in jobs if job.state == State.RUNNING]
        pid, _, _, _ = _read_pid_file(PID_FILE)

        # requeue stalled jobs
        for job in running:
            job_pid = job.extra_metadata.get("PID", None)
            if job_pid and job_pid != pid:
                job.extra_metadata["PID"] = pid
                job.save_meta()
                job.storage._update_job(job.job_id, State.QUEUED)

        running_states = [
            State.RUNNING,
            State.QUEUED,
        ]

        finished_states = [
            State.CANCELING,
            State.CANCELED,
        ]

        jobs = [job for job in jobs if job.state not in finished_states]
        running_jobs = len(
            [job for job in jobs if job.state in running_states]
        )
        if running_jobs == 0 and "downloading" in request.session:
            del request.session["downloading"]
            del request.session["job_ids"]

        collection = request.session.get("downloading")
        self.update_collection_from_json()
        jobs_response = {
            "collections": self.grade_collections,
            "collection": collection,
            "jobs": [self._job_to_response(job) for job in jobs],
        }

        return HttpResponse(
            json.dumps(jobs_response), content_type="application/json"
        )

    def post(self, request):
        collection_grade = "primary"
        collection_name = "small"
        if request.body:
            data = json.loads(request.body)
            collection_grade = data.get("grade", "primary")
            collection_name = data.get("collection", "small")

        # Do nothing if already downloading
        if "downloading" in request.session:
            job_ids = request.session["job_ids"]
            return HttpResponse(
                json.dumps(job_ids), content_type="application/json"
            )

        collection = self.grade_collections[collection_grade][collection_name]
        if not collection["loaded"]:
            raise Http404("Collection manifest not found")

        channels = collection["channels"]

        job_ids = []
        pid, _, _, _ = _read_pid_file(PID_FILE)
        baseurl = conf.OPTIONS["Urls"]["CENTRAL_CONTENT_BASE_URL"]

        for channel in channels:
            channels = RemoteChannelViewSet()._make_channel_endpoint_request(
                channel["id"],
                baseurl=baseurl,
            )
            channel_name = ""
            if channels:
                channel_name = channels[0]["name"]

            task = {
                "channel_id": channel["id"],
                "channel_name": channel_name,
                "baseurl": baseurl,
                "started_by_username": "endless",
                "type": "REMOTEIMPORT",
                "PID": pid,
            }

            job_id = remoteimport.enqueue(
                args=[task["channel_id"]],
                kwargs=dict(
                    baseurl=task["baseurl"],
                    # Done this way to convert [] to None
                    node_ids=channel.get("include_node_ids") or None,
                    # Done this way to convert [] to None
                    exclude_node_ids=channel.get("exclude_node_ids") or None,
                ),
                extra_metadata=task,
            )
            job_ids.append(job_id)

        # Two weeks session expiry
        request.session.set_expiry(1209600)
        request.session["job_ids"] = job_ids
        request.session[
            "downloading"
        ] = f"{collection_grade}-{collection_name}"
        return HttpResponse(
            json.dumps(job_ids), content_type="application/json"
        )
