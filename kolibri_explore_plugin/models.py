from django.db import models
from kolibri.core.content.models import ContentNode
from morango.models import UUIDField


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
