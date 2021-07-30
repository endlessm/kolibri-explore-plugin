from kolibri.core.content.api import ContentNodeSearchViewset
from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentTag
from rest_framework.decorators import list_route
from rest_framework.response import Response


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

    @list_route(methods=["get"])
    def random_from_channel(self, request, **kwargs):
        channel_id = self.request.query_params.get("channel_id", None)
        if channel_id is None:
            return Response([])
        count = int(self.request.query_params.get("count", 1))
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(channel_id=channel_id)
        queryset = queryset.order_by("?")[:count]
        serialized = list(queryset.values("id"))
        return Response(serialized)


class CustomContentNodeSearchViewset(
    CustomContentNodeViewset, ContentNodeSearchViewset
):
    pass
