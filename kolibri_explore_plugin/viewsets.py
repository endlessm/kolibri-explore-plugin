from kolibri.core.content.api import ContentNodeSearchViewset
from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentNode
from kolibri.core.content.models import ContentTag
from rest_framework.decorators import list_route
from rest_framework.response import Response


class CustomContentNodeViewset(ContentNodeViewset):
    values = (
        "id",
        "author",
        "available",
        "channel_id",
        "coach_content",
        "content_id",
        "description",
        "kind",
        # Language keys
        "lang__id",
        "lang__lang_code",
        "lang__lang_subcode",
        "lang__lang_name",
        "lang__lang_direction",
        "license_description",
        "license_name",
        "license_owner",
        "num_coach_contents",
        "options",
        "parent",
        "sort_order",
        "title",
        "lft",
        "rght",
        "tree_id",
    )

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

        # We need to batch our queries for ancestors as the size of
        # the expression tree depends on the number of nodes that we
        # are querying for.  On Windows, the SQL parameter limit is
        # 999, and an ancestors call can produce 3 parameters per node
        # in the queryset, so this should max out the parameters at
        # 750.
        ANCESTOR_BATCH_SIZE = 250

        if len(items) > ANCESTOR_BATCH_SIZE:

            ancestors_map = {}

            for i in range(0, len(items), ANCESTOR_BATCH_SIZE):

                for anc in (
                    ContentNode.objects.filter(
                        id__in=[
                            item["id"]
                            for item in items[i : i + ANCESTOR_BATCH_SIZE]
                        ]
                    )
                    .get_ancestors()
                    .values("id", "title", "lft", "rght", "tree_id")
                ):
                    ancestors_map[anc["id"]] = anc

            ancestors = sorted(ancestors_map.values(), key=lambda x: x["lft"])
        else:
            ancestors = list(
                queryset.get_ancestors()
                .values("id", "title", "lft", "rght", "tree_id")
                .order_by("lft")
            )

        def ancestor_lookup(item):
            lft = item.get("lft")
            rght = item.get("rght")
            tree_id = item.get("tree_id")
            item["ancestors"] = list(
                map(
                    lambda x: {"id": x["id"], "title": x["title"]},
                    filter(
                        lambda x: x["lft"] < lft
                        and x["rght"] > rght
                        and x["tree_id"] == tree_id,
                        ancestors,
                    ),
                )
            )
            return item

        def add_tag(item):
            item["tags"] = tags.get(item["id"], [])
            return item

        return [ancestor_lookup(add_tag(item)) for item in items]

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
