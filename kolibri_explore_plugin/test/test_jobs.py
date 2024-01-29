import pytest
from django.core.management import call_command
from kolibri.core.tasks.job import State

from .utils import wait_for_background_tasks
from kolibri_explore_plugin import jobs
from kolibri_explore_plugin.models import BackgroundTask


def importchannel(channel_id):
    return call_command("importchannel", "network", channel_id)


@pytest.mark.django_db
def test_get_applyexternaltags_task():
    node_id = "b51baf46133045e3bce4d2d872a8f71d"
    tags = ["foo", "bar", "baz"]
    task = jobs.get_applyexternaltags_task(node_id, tags)
    assert task == {
        "task": jobs.TaskType.APPLYEXTERNALTAGS,
        "params": {
            "node_id": node_id,
            "tags": tags,
        },
    }


@pytest.mark.usefixtures("channel_import_db", "content_server")
@pytest.mark.django_db
def test_get_remotechannelimport_task():
    channel_id = "b51baf46133045e3bce4d2d872a8f71d"
    task = jobs.get_remotechannelimport_task(channel_id)
    assert task == {
        "task": jobs.TaskType.REMOTECHANNELIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "unknown",
        },
    }

    # Specify the channel name.
    task = jobs.get_remotechannelimport_task(channel_id, "foo")
    assert task == {
        "task": jobs.TaskType.REMOTECHANNELIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "foo",
        },
    }

    # After importing the channel, the channel name will be known.
    importchannel(channel_id)
    task = jobs.get_remotechannelimport_task(channel_id)
    assert task == {
        "task": jobs.TaskType.REMOTECHANNELIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "testing",
        },
    }


@pytest.mark.usefixtures("channel_import_db", "content_server")
@pytest.mark.django_db
def test_get_remotecontentimport_task():
    channel_id = "b51baf46133045e3bce4d2d872a8f71d"
    node_ids = [
        "5a24503255ce43d98ebcb25d2b60f024",
        "91a1bfc0ede544979f861909b7862537",
    ]

    # If the channel doesn't exist an exception will be raised.
    with pytest.raises(ValueError, match=r"does not exist"):
        jobs.get_remotecontentimport_task(channel_id)

    # Import the channel and try again with no nodes specified.
    importchannel(channel_id)
    task = jobs.get_remotecontentimport_task(channel_id)
    assert task == {
        "task": jobs.TaskType.REMOTECONTENTIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "testing",
            "node_ids": None,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Specify the nodes.
    task = jobs.get_remotecontentimport_task(channel_id, node_ids=node_ids)
    assert task == {
        "task": jobs.TaskType.REMOTECONTENTIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "testing",
            "node_ids": node_ids,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Override the channel name.
    task = jobs.get_remotecontentimport_task(channel_id, channel_name="foo")
    assert task == {
        "task": jobs.TaskType.REMOTECONTENTIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "foo",
            "node_ids": None,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Specify an empty node list and all_thumbnails.
    task = jobs.get_remotecontentimport_task(
        channel_id, node_ids=[], all_thumbnails=True
    )
    assert task == {
        "task": jobs.TaskType.REMOTECONTENTIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "testing",
            "node_ids": [],
            "exclude_node_ids": [],
            "all_thumbnails": True,
            "fail_on_error": True,
        },
    }


@pytest.mark.usefixtures("channel_import_db", "content_server")
@pytest.mark.django_db
def test_get_remoteimport_task():
    channel_id = "b51baf46133045e3bce4d2d872a8f71d"
    node_ids = [
        "5a24503255ce43d98ebcb25d2b60f024",
        "91a1bfc0ede544979f861909b7862537",
    ]

    # No nodes specified.
    task = jobs.get_remoteimport_task(channel_id)
    assert task == {
        "task": jobs.TaskType.REMOTEIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "unknown",
            "node_ids": None,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Specify the nodes.
    task = jobs.get_remoteimport_task(channel_id, node_ids=node_ids)
    assert task == {
        "task": jobs.TaskType.REMOTEIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "unknown",
            "node_ids": node_ids,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Override the channel name.
    task = jobs.get_remoteimport_task(channel_id, channel_name="foo")
    assert task == {
        "task": jobs.TaskType.REMOTEIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "foo",
            "node_ids": None,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }

    # Specify an empty node list and all_thumbnails.
    task = jobs.get_remoteimport_task(
        channel_id, node_ids=[], all_thumbnails=True
    )
    assert task == {
        "task": jobs.TaskType.REMOTEIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "unknown",
            "node_ids": [],
            "exclude_node_ids": [],
            "all_thumbnails": True,
            "fail_on_error": True,
        },
    }

    # After importing the channel, the channel name will be known.
    importchannel(channel_id)
    task = jobs.get_remoteimport_task(channel_id)
    assert task == {
        "task": jobs.TaskType.REMOTEIMPORT,
        "params": {
            "channel_id": channel_id,
            "channel_name": "testing",
            "node_ids": None,
            "exclude_node_ids": [],
            "all_thumbnails": False,
            "fail_on_error": True,
        },
    }


@pytest.mark.usefixtures(
    "channel_import_db", "content_server", "facility_user", "worker"
)
@pytest.mark.django_db
def test_enqueue_next_background_task():
    # Create a content import task. Note that a channel import task isn't used
    # here because that also enqueues a subsequent thumbnail import task.
    channel_id = "b51baf46133045e3bce4d2d872a8f71d"
    node_ids = [
        "5a24503255ce43d98ebcb25d2b60f024",
        "91a1bfc0ede544979f861909b7862537",
    ]
    importchannel(channel_id)
    task_data = jobs.get_remotecontentimport_task(
        channel_id, node_ids=node_ids
    )
    task = BackgroundTask.create_from_task_data(task_data)

    enqueued_task = jobs.enqueue_next_background_task()
    assert enqueued_task == task
    wait_for_background_tasks(10)

    # Check that the task completed and no other background tasks were run.
    task.refresh_from_db()
    assert task.job_state == State.COMPLETED
    assert list(BackgroundTask.objects.all()) == [task]
