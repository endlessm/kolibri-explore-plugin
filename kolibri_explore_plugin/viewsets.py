from kolibri.core.content.api import ContentNodeSearchViewset
from kolibri.core.content.api import ContentNodeViewset
from rest_framework.decorators import list_route
from rest_framework.response import Response


class CustomContentNodeViewset(ContentNodeViewset):
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
