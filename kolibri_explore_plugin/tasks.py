# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import logging

from django.core.management import call_command
from kolibri.core.content import tasks as content_tasks
from kolibri.core.serializers import HexOnlyUUIDField
from kolibri.core.tasks.decorators import register_task
from kolibri.core.tasks.job import Priority
from kolibri.core.tasks.permissions import CanManageContent
from kolibri.core.tasks.validation import JobValidator
from rest_framework.serializers import CharField
from rest_framework.serializers import ListField

from .jobs import QUEUE

logger = logging.getLogger(__name__)


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


# This is a duplicate of the upstream remotecontentimport task with the
# priority raised to HIGH.
@register_task(
    validator=content_tasks.RemoteChannelResourcesImportValidator,
    track_progress=True,
    cancellable=True,
    permission_classes=[CanManageContent],
    priority=Priority.HIGH,
    queue=QUEUE,
    long_running=True,
    status_fn=content_tasks.get_status,
)
def remotecontentimport(*args, **kwargs):
    return content_tasks.remotecontentimport.func(*args, **kwargs)
