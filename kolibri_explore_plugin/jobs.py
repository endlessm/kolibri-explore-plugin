# Kolibri job management and helpers
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import logging

from kolibri.core.content.models import ChannelMetadata
from kolibri.core.tasks.job import Priority
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import job_storage
from kolibri.core.tasks.utils import import_path_to_callable

logger = logging.getLogger(__name__)

QUEUE = "content"
BACKGROUND_QUEUE = "explore-bg"


class TaskType:
    """Constants for tasks"""

    APPLYEXTERNALTAGS = "kolibri_explore_plugin.tasks.applyexternaltags"
    REMOTECHANNELIMPORT = "kolibri.core.content.tasks.remotechannelimport"
    REMOTECONTENTIMPORT = "kolibri_explore_plugin.tasks.remotecontentimport"


def get_channel_metadata(channel_id):
    return ChannelMetadata.objects.get(id=channel_id)


def get_applyexternaltags_task(node_id, tags):
    return {
        "task": TaskType.APPLYEXTERNALTAGS,
        "params": {
            "node_id": node_id,
            "tags": tags,
        },
    }


def get_remotechannelimport_task(channel_id, channel_name=None):
    if not channel_name:
        # Try to get the channel name from an existing channel database,
        # but this will fail on first import.
        try:
            channel_metadata = get_channel_metadata(channel_id)
        except ChannelMetadata.DoesNotExist:
            channel_name = "unknown"
        else:
            channel_name = channel_metadata.name
    return {
        "task": TaskType.REMOTECHANNELIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": channel_name,
        },
    }


def get_remotecontentimport_task(
    channel_id,
    channel_name=None,
    node_ids=None,
    all_thumbnails=False,
):
    if not channel_name:
        channel_metadata = get_channel_metadata(channel_id)
        channel_name = channel_metadata.name
    if node_ids is None:
        node_ids = []
    return {
        "task": TaskType.REMOTECONTENTIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "node_ids": node_ids,
            "exclude_node_ids": [],
            "all_thumbnails": all_thumbnails,
            "fail_on_error": True,
        },
    }


def enqueue_task(task, user, queue=QUEUE, priority=Priority.HIGH, **params):
    """Enqueue task as new job"""
    task_func = import_path_to_callable(task)
    job_data, _ = task_func.validate_job_data(user, params)
    return job_storage.enqueue_job(job_data, queue=queue, priority=priority)


def restart_failed_background_jobs():
    for job in job_storage.get_all_jobs(queue=BACKGROUND_QUEUE):
        if job.state == State.FAILED:
            logger.info(
                f"Restarting failed background {job.func} job {job.job_id}"
            )
            job_storage.restart_job(job.job_id)
