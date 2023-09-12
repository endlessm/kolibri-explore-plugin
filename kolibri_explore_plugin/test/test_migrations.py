# Django migration tests.
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import json

import pytest
from django.core.management import call_command
from kolibri.core.tasks import main as tasks_main
from kolibri.core.tasks.job import Job
from kolibri.core.tasks.job import State

from ..jobs import TaskType
from ..models import BackgroundTask


@pytest.mark.django_db
def test_backgroundtask_populate(monkeypatch):
    """Test population of BackgroundTask existing jobs"""
    # Create some fake existing jobs and a mock job_storage that just
    # returns them.
    jobs = [
        Job(
            func=TaskType.APPLYEXTERNALTAGS,
            args=("05b75a43c5834f838784cfc9dc45f60e",),
            kwargs={"tags": ["foo", "bar"]},
            job_id="7b7ba93d00dd46cf81767dcfa705b82b",
            state=State.COMPLETED,
        ),
        Job(
            func=TaskType.REMOTECHANNELIMPORT,
            args=("cd0c3fbff39247d8b1ef04a39a9760ea",),
            kwargs={"channel_name": "something"},
            job_id="f4710b76e9e149c197acf394daae464b",
            state=State.PENDING,
        ),
        Job(
            func=TaskType.REMOTECONTENTIMPORT,
            args=("cd0c3fbff39247d8b1ef04a39a9760ea",),
            kwargs={
                "channel_name": "something",
                "node_ids": ["5658a2696db1454790c1ca9397d9f894"],
            },
            job_id="3c2991aae66a42649919ba22c8bb9b65",
            state=State.PENDING,
        ),
    ]

    class MockJobStorage:
        def get_all_jobs(*args, **kwargs):
            return jobs

    monkeypatch.setattr(tasks_main, "job_storage", MockJobStorage())

    # Reverse to before the BackgroundTask migration and then run all
    # the forward migrations again so that the population executes.
    call_command("migrate", "kolibri_explore_plugin", "0001_initial")
    call_command("migrate")

    # Validate that BackgroundTask contains the existing jobs.
    expected_tasks = []
    for pk, job in enumerate(jobs, start=1):
        params = job.kwargs.copy()
        if job.func == TaskType.APPLYEXTERNALTAGS:
            params["node_id"] = job.args[0]
        else:
            params["channel_id"] = job.args[0]
        params = json.dumps(params, sort_keys=True)
        expected_tasks.append((pk, job.func, params, job.job_id, job.state))
    assert list(BackgroundTask.objects.values_list()) == expected_tasks
