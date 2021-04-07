from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentTag


class CustomContentNodeViewset(ContentNodeViewset):
    def _consolidate(self, items, queryset):
        if not items:
            return []

        tags = {}
        for t in ContentTag.objects.filter(tagged_content__in=queryset).values(
            "tag_name",
            "tagged_content",
        ):
            if t["tagged_content"] not in tags:
                tags[t["tagged_content"]] = [t["tag_name"]]
            else:
                tags[t["tagged_content"]].append(t["tag_name"])

        def add_tag(item):
            item["tags"] = tags.get(item["id"], [])
            return item

        return [add_tag(item) for item in items]

    def consolidate(self, items, queryset):
        new_items = super().consolidate(items, queryset)
        return self._consolidate(new_items, queryset)
