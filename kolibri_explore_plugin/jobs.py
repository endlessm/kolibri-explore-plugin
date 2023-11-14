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
from kolibri.core.utils.lock import db_lock

from .models import BackgroundTask

logger = logging.getLogger(__name__)

QUEUE = "content"
BACKGROUND_QUEUE = "explore-bg"


class TaskType:
    """Constants for tasks"""

    APPLYEXTERNALTAGS = "kolibri_explore_plugin.tasks.applyexternaltags"
    REMOTECHANNELIMPORT = "kolibri.core.content.tasks.remotechannelimport"
    REMOTECONTENTIMPORT = "kolibri_explore_plugin.tasks.remotecontentimport"
    REMOTEIMPORT = "kolibri.core.content.tasks.remoteimport"


def get_channel_metadata(channel_id):
    """Returns the ChannelMetadata object or None if it doesn't exist"""
    try:
        return ChannelMetadata.objects.get(id=channel_id)
    except ChannelMetadata.DoesNotExist:
        return None


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
        channel_metadata = get_channel_metadata(channel_id)
        if channel_metadata:
            channel_name = channel_metadata.name
        else:
            channel_name = "unknown"
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
        if not channel_metadata:
            raise ValueError(f"Channel {channel_id} does not exist")
        channel_name = channel_metadata.name
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


def get_remoteimport_task(
    channel_id,
    channel_name=None,
    node_ids=None,
    all_thumbnails=False,
):
    if not channel_name:
        # Try to get the channel name from an existing channel database,
        # but this will fail on first import.
        channel_metadata = get_channel_metadata(channel_id)
        if channel_metadata:
            channel_name = channel_metadata.name
        else:
            channel_name = "unknown"
    return {
        "task": TaskType.REMOTEIMPORT,
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
    """Locate the next background task and enqueue it for running

    Returns the enqueued BackgroundTask or None if no task was enqueued.
    """

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
        return None

    task = BackgroundTask.objects.filter(job_id="").first()
    if not task:
        logger.debug("All background tasks completed")
        return None

    # If the enqueued job changes state before the job ID has been recorded,
    # the storage hook will skip the event since it won't find the background
    # atask. Lock the database until that happens to prevent the storage hook
    # from reading the BackgroundTask table.
    logger.info(f"Starting BackgroundTask {task}")
    params = json.loads(task.params)
    with db_lock():
        job_id = enqueue_task(
            task.func,
            queue=BACKGROUND_QUEUE,
            priority=Priority.REGULAR,
            **params,
        )
        task.update_job_id(job_id)

    return task


def storage_update_hook(job, orm_job, state=None, **kwargs):
    """StorageHook update hook"""
    logger.debug(f"Running storage hook for {job}")

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
        logger.debug(f"Updating {bg_task} job state to {state}")
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
        #
        # FIXME: Previously the extra channels and their thumbnails were
        # imported using 2 tasks. In order to keep the thumbnail task from
        # being created before the channel was imported, the thumbnail task was
        # created on the fly here. Now this is done with a single combined
        # remoteimport task and this is no longer needed. However, it's kept
        # for now in case there are existing installations that had started the
        # background tasks but not completed them. Drop this at some point.
        #
        # https://github.com/endlessm/kolibri-explore-plugin/issues/890
        if bg_task.func == TaskType.REMOTECHANNELIMPORT:
            bg_task_params = json.loads(bg_task.params)
            channel_id = bg_task_params["channel_id"]
            logger.warning(
                f"Creating thumbnail task for {channel_id} legacy background "
                "channel import task"
            )
            thumbnail_task_data = get_remotecontentimport_task(
                channel_id, node_ids=[], all_thumbnails=True
            )
            BackgroundTask.create_from_task_data(thumbnail_task_data)

        # Start the next background task, if any.
        enqueue_next_background_task()
