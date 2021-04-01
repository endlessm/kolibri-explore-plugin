from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentNode


class CustomContentNodeViewset(ContentNodeViewset):
    def _consolidate(self, items, queryset):
        if not items:
            return []

        def add_tag(item):
            node = ContentNode.objects.get(id=item["id"])
            item["tags"] = [tag.tag_name for tag in node.tags.all()]
            return item

        return list(map(add_tag, items))

    def consolidate(self, items, queryset):
        new_items = super().consolidate(items, queryset)
        return self._consolidate(new_items, queryset)
