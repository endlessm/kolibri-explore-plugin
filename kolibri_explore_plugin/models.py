# Copyright 2022-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import json
import logging

from django.db import models
from kolibri.core.content.models import ContentNode
from kolibri.core.tasks.job import State
from morango.models import UUIDField

logger = logging.getLogger(__name__)


class ExternalContentTag(models.Model):
    id = UUIDField(primary_key=True)
    tag_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.tag_name


class ContentNodeExtras(models.Model):
    content_node = models.OneToOneField(
        ContentNode, on_delete=models.CASCADE, primary_key=True
    )
    tags = models.ManyToManyField(
        ExternalContentTag,
        symmetrical=False,
        related_name="tagged_content",
    )

    def __str__(self):
        return self.content_node.title


class CollectionState(models.Model):
    """Persist state of collections"""

    name = models.SlugField(
        blank=False,
        max_length=64,
        help_text=(
            "Collection name. Must be unique along with the sequence number"
        ),
    )

    sequence = models.PositiveIntegerField(
        blank=False,
        help_text=(
            "Collection sequence number. Must be unique along with the name"
        ),
    )

    language_id = models.CharField(
        max_length=15,
        help_text="Collection language.",
    )

    is_current = models.BooleanField(
        default=False,
        help_text=(
            "Is this the current collection? "
            "Only one collection can be current."
        ),
    )

    is_extra = models.BooleanField(
        default=False,
        help_text=(
            "An extra collection can't be current. "
            "Contains extra content for collections of same language."
        ),
    )

    # Metadata:

    title = models.CharField(
        max_length=64,
        help_text="Collection title as displayed in the UI.",
    )

    subtitle = models.CharField(
        max_length=512,
        help_text="Collection subtitle as displayed in the UI.",
    )

    description = models.CharField(
        max_length=512,
        help_text="Collection description as displayed in the UI.",
    )

    required_gigabytes = models.PositiveIntegerField(
        default=0,
        help_text=("Disk size needed for installing the collection."),
    )

    # Collection installed status:

    metadata_installed = models.BooleanField(
        default=False,
        help_text=(
            "Whether the metadata of each channel in the "
            "collection has been installed."
        ),
    )

    thumbnails_installed = models.BooleanField(
        default=False,
        help_text=(
            "Whether the thumbnails of each channel in "
            "the collection has been installed."
        ),
    )

    content_installed = models.BooleanField(
        default=False,
        help_text=(
            "Whether the content of each channel in the "
            "collection has been installed."
        ),
    )

    tags_applied = models.BooleanField(
        default=False,
        help_text=(
            "Whether the ExternalContentTag for content in"
            " the collection has been applied."
        ),
    )

    class Meta:
        unique_together = ("name", "sequence")

    def __str__(self):
        return f"{self.name} - {self.sequence}"

    @classmethod
    def current_exists(cls):
        """Check if one of the collections is current."""
        return cls.objects.filter(is_current=True).exists()


class BackgroundTask(models.Model):
    """Task for background content downloads"""

    JOB_STATE_CHOICES = tuple(
        (state, state.title()) for state in sorted(State.States)
    )

    func = models.CharField(
        max_length=64,
        help_text="Fully qualified task function path",
    )
    params = models.CharField(
        max_length=512,
        help_text="JSON encoded task parameters",
    )
    job_id = models.CharField(
        max_length=32,
        blank=True,
        default="",
        help_text="Job identifier",
    )
    job_state = models.CharField(
        max_length=16,
        choices=JOB_STATE_CHOICES,
        default=State.PENDING,
        help_text="Job state",
    )

    def __str__(self):
        return (
            f"func: {self.func}, params: {self.params}, "
            f"job_id: {self.job_id}, job_state: {self.job_state}"
        )

    @classmethod
    def create_from_task_data(cls, task_data):
        """Create BackgroundTask from task data dict"""
        params = json.dumps(task_data["params"])
        task = cls.objects.create(func=task_data["task"], params=params)
        logger.info(f"Created BackgroundTask {task}")
        return task

    def update_job_id(self, job_id):
        """Set a new job ID and reset the state to PENDING"""
        logger.debug(f"Updating {self} job ID to {job_id}")
        self.job_id = job_id
        self.job_state = State.PENDING
        self.save()
