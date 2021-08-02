from kolibri.core.content.api import ContentNodeSearchViewset
from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentTag
from rest_framework.decorators import list_route
from rest_framework.response import Response


class CustomContentNodeViewset(ContentNodeViewset):
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.prefetch_queryset(self.get_queryset())
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            # FIXME paginate_queryset above is returning a list of objects,
            # and the serialize method assumes a queryset:
            node_ids = [n.pk for n in page]
            page = queryset.filter(pk__in=node_ids)
            return self.get_paginated_response(self.serialize(page))

        return Response(self.serialize(queryset))

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
    def list(self, request, **kwargs):
        return ContentNodeSearchViewset.list(self, request, **kwargs)
