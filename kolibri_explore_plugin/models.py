from django.db import models
from kolibri.core.content.models import ContentNode
from morango.models import UUIDField


class ExternalContentTag(models.Model):
    id = UUIDField(primary_key=True)
    tag_name = models.CharField(max_length=100, unique=True)
    content_nodes = models.ManyToManyField(
        ContentNode,
        symmetrical=False,
        related_name="tagged_content",
    )

    def __str__(self):
        return self.tag_name
