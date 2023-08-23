# Django model tests.
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import uuid

import pytest
from django.core.management import call_command
from kolibri.core.content.models import ContentNode

from ..models import ContentNodeExtras
from ..models import ExternalContentTag


@pytest.mark.django_db
class TestExternalContentTag:
    """ExternalContentTag model tests"""

    def test_initial(self):
        tags = ExternalContentTag.objects.all()
        assert list(tags) == []

    def test_create(self):
        ExternalContentTag.objects.create(
            id=uuid.uuid4().hex,
            tag_name="foo",
        )
        ExternalContentTag.objects.get(tag_name="foo")
        tags = ExternalContentTag.objects.values_list("tag_name", flat=True)
        assert list(tags) == ["foo"]


@pytest.mark.django_db
class TestContentNodeExtras:
    """ContentNodeExtras model tests"""

    def test_initial(self, content_data):
        extras = ContentNodeExtras.objects.all()
        assert list(extras) == []
        nodes_with_extras = ContentNode.objects.filter(
            contentnodeextras__isnull=False,
        )
        assert list(nodes_with_extras) == []

    def test_add_tag(self, content_data):
        node = ContentNode.objects.first()
        tag = ExternalContentTag.objects.create(
            id=uuid.uuid4().hex,
            tag_name="foo",
        )
        extras = ContentNodeExtras.objects.create(content_node=node)
        extras.tags.add(tag)
        assert list(extras.tags.all()) == [tag]
        assert list(tag.tagged_content.all()) == [extras]
        assert node.contentnodeextras == extras

    def test_command(self, content_data):
        node = ContentNode.objects.first()
        call_command("applyexternaltags", node.id, tags=["foo", "bar"])
        assert hasattr(node, "contentnodeextras")
        tags = ExternalContentTag.objects.all()
        tag_names = tags.values_list("tag_name", flat=True).order_by(
            "tag_name"
        )
        assert list(tag_names) == ["bar", "foo"]
        for tag in tags:
            assert list(tag.tagged_content.all()) == [node.contentnodeextras]
