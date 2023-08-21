# Kolibri job management and helpers
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import json
import logging

from kolibri.core.auth.models import FacilityUser
from kolibri.core.content.models import ChannelMetadata
from kolibri.core.tasks.job import Priority
from kolibri.core.tasks.job import State
from kolibri.core.tasks.main import job_storage
from kolibri.core.tasks.utils import import_path_to_callable

from .models import BackgroundTask

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


def get_content_task_user():
    """Get a Kolibri user for content task usage"""
    return FacilityUser.objects.filter(
        devicepermissions__can_manage_content=True
    ).first()


def enqueue_task(
    task, user=None, queue=QUEUE, priority=Priority.HIGH, **params
):
    """Enqueue task as new job"""
    if user is None:
        user = get_content_task_user()
    task_func = import_path_to_callable(task)
    job_data, _ = task_func.validate_job_data(user, params)
    return job_storage.enqueue_job(job_data, queue=queue, priority=priority)


def enqueue_next_background_task():
    """Locate the next background task and enqueue it for running"""

    # If there's already a job in progress, do nothing. We only want a
    # single background task running in order to not slow down the user
    # interface and to leave room in the worker pool for user-triggered
    # downloads.
    #
    # https://github.com/endlessm/kolibri-explore-plugin/pull/762
    in_progress_jobs = BackgroundTask.objects.exclude(job_id="").exclude(
        job_state__in=[State.FAILED, State.CANCELED, State.COMPLETED]
    )
    if in_progress_jobs.exists():
        logger.debug("Not enqueuing next task as tasks in progress")
        return

    task = BackgroundTask.objects.filter(job_id="").first()
    if not task:
        logger.debug("All background tasks completed")
        return

    logger.info(f"Starting BackgroundTask {task}")
    params = json.loads(task.params)
    job_id = enqueue_task(
        task.func,
        queue=BACKGROUND_QUEUE,
        priority=Priority.REGULAR,
        **params,
    )
    task.update_job_id(job_id)


def storage_update_hook(job, orm_job, state=None, **kwargs):
    """StorageHook update hook"""
    if state is None:
        # We only care about state transitions here.
        return

    try:
        bg_task = BackgroundTask.objects.get(job_id=job.job_id)
    except BackgroundTask.DoesNotExist:
        # Not one of our tasks.
        return

    # Synchronize the state if needed.
    if bg_task.job_state != state:
        bg_task.job_state = state
        bg_task.save()

    if state in (State.FAILED, State.CANCELED):
        # Restart incomplete background jobs. Assume that a job is only
        # canceled by a worker stopping and it should be restarted.
        logger.info(f"Restarting incomplete BackgroundTask {bg_task}")
        new_job_id = job_storage.restart_job(bg_task.job_id)
        bg_task.update_job_id(new_job_id)
    elif state == State.COMPLETED:
        # If the completed task is a channel import, create the
        # associated thumbnail download task to be run later.
        if bg_task.func == TaskType.REMOTECHANNELIMPORT:
            bg_task_params = json.loads(bg_task.params)
            channel_id = bg_task_params["channel_id"]
            thumbnail_task_data = get_remotecontentimport_task(
                channel_id, all_thumbnails=True
            )
            BackgroundTask.create_from_task_data(thumbnail_task_data)

        # Start the next background task, if any.
        enqueue_next_background_task()
