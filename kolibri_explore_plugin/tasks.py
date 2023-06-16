import logging

from django.core.management import call_command
from kolibri.core.content.tasks import get_status as get_content_task_status
from kolibri.core.content.tasks import RemoteChannelResourcesImportValidator
from kolibri.core.content.utils.paths import get_content_storage_remote_url
from kolibri.core.content.utils.resource_import import (
    RemoteChannelResourceImportManager,
)
from kolibri.core.content.utils.resource_import import (
    RemoteChannelUpdateManager,
)
from kolibri.core.content.utils.resource_import import (
    RemoteResourceImportManagerBase,
)
from kolibri.core.serializers import HexOnlyUUIDField
from kolibri.core.tasks.decorators import register_task
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import job_storage
from kolibri.core.tasks.permissions import CanManageContent
from kolibri.core.tasks.validation import JobValidator
from rest_framework.serializers import CharField
from rest_framework.serializers import ListField

from .vendor.file_transfer import FileDownload

logger = logging.getLogger(__name__)

QUEUE = "content"
BACKGROUND_QUEUE = "explore-bg"


class ExternalTagsJobValidator(JobValidator):
    node_id = HexOnlyUUIDField()
    tags = ListField(child=CharField(), required=False)

    def validate(self, data):
        job_data = super(ExternalTagsJobValidator, self).validate(data)
        job_data.update(
            {
                "args": [data["node_id"]],
                "kwargs": {
                    "tags": data.get("tags"),
                },
            }
        )
        return job_data


@register_task(
    validator=ExternalTagsJobValidator,
    track_progress=True,
    cancellable=True,
    permission_classes=[CanManageContent],
    queue=QUEUE,
)
def applyexternaltags(node_id, tags=None):
    call_command("applyexternaltags", node_id, tags=tags)


# Local remote resource import overrides to use vendored FileDownload.
class ExploreRemoteResourceImportManagerBase(RemoteResourceImportManagerBase):
    def create_file_transfer(self, f, filename, dest):
        url = get_content_storage_remote_url(filename, baseurl=self.baseurl)
        return FileDownload(
            url,
            dest,
            f["id"],
            session=self.session,
            cancel_check=self.is_cancelled,
            timeout=self.timeout,
        )


class ExploreRemoteChannelResourceImportManager(
    ExploreRemoteResourceImportManagerBase, RemoteChannelResourceImportManager
):
    pass


class ExploreRemoteChannelUpdateManager(
    ExploreRemoteResourceImportManagerBase, RemoteChannelUpdateManager
):
    pass


@register_task(
    validator=RemoteChannelResourcesImportValidator,
    track_progress=True,
    cancellable=True,
    permission_classes=[CanManageContent],
    queue=QUEUE,
    long_running=True,
    status_fn=get_content_task_status,
)
def remotecontentimport(
    channel_id,
    baseurl=None,
    peer_id=None,
    node_ids=None,
    exclude_node_ids=None,
    update=False,
    fail_on_error=False,
    all_thumbnails=False,
):
    manager_class = (
        ExploreRemoteChannelUpdateManager
        if update
        else ExploreRemoteChannelResourceImportManager
    )
    manager = manager_class(
        channel_id,
        baseurl=baseurl,
        peer_id=peer_id,
        node_ids=node_ids,
        exclude_node_ids=exclude_node_ids,
        fail_on_error=fail_on_error,
        all_thumbnails=all_thumbnails,
    )
    manager.run()


def restart_failed_background_jobs():
    for job in job_storage.get_all_jobs(queue=BACKGROUND_QUEUE):
        if job.state == State.FAILED:
            logger.info(
                f"Restarting failed background {job.func} job {job.job_id}"
            )
            job_storage.restart_job(job.job_id)
