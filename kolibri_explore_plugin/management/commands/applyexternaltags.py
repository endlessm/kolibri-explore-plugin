import logging
import uuid

from django.core.management.base import CommandError
from kolibri.core.content.models import ContentNode
from kolibri.core.tasks.management.commands.base import AsyncCommand

from kolibri_explore_plugin.models import ContentNodeExtras
from kolibri_explore_plugin.models import ExternalContentTag

logger = logging.getLogger(__name__)


class Command(AsyncCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "node_id",
            type=str,
            help="A node ID.",
        )

        parser.add_argument(
            "--tags",
            # Split the comma separated string we get, into a list of strings
            type=lambda x: x.split(",") if x else [],
            default=None,
            required=False,
            dest="tags",
            help="Specify one or more external tags to apply.",
        )

    def handle_async(self, *args, **options):
        content_node = None
        try:
            content_node = ContentNode.objects.get(id=options["node_id"])
        except ContentNode.DoesNotExist:
            logger.warning(
                f"There isn't any node with ID {options['node_id']}. Skipping"
            )
            return
        except ValueError:
            raise CommandError(f"{options['node_id']} is not a valid node ID")

        content_extras = ContentNodeExtras(content_node=content_node)
        content_extras.save()

        for tag_name in options["tags"]:
            tag_name = tag_name.strip()
            if tag_name == "":
                continue

            tag = None
            try:
                tag = ExternalContentTag.objects.get(tag_name=tag_name)
            except ExternalContentTag.DoesNotExist:
                tag = ExternalContentTag(
                    id=uuid.uuid4().hex, tag_name=tag_name
                )
                tag.save()

            content_extras.tags.add(tag)

        self.stdout.write(
            self.style.SUCCESS(f"Added external tags to node: {content_node}")
        )
