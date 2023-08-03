import logging

from django.core.management import call_command
from kolibri.core.serializers import HexOnlyUUIDField
from kolibri.core.tasks.decorators import register_task
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import job_storage
from kolibri.core.tasks.permissions import CanManageContent
from kolibri.core.tasks.validation import JobValidator
from rest_framework.serializers import CharField
from rest_framework.serializers import ListField

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


def restart_failed_background_jobs():
    for job in job_storage.get_all_jobs(queue=BACKGROUND_QUEUE):
        if job.state == State.FAILED:
            logger.info(
                f"Restarting failed background {job.func} job {job.job_id}"
            )
            job_storage.restart_job(job.job_id)
