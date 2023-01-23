from kolibri.core.api import ReadOnlyValuesViewset
from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.models import ContentNode
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ContentNodeExtras
from .models import ExternalContentTag


class ExternalContentTagViewset(ReadOnlyValuesViewset):
    values = ("id", "tag_name")

    def get_queryset(self):
        return ExternalContentTag.objects.all()


class ContentNodeExtrasViewset(ContentNodeViewset):
    @action(detail=False)
    def by_external_tag(self, request):
        tag = self.request.query_params.get("tag", None)
        queryset = self.filter_queryset(self.get_queryset())
        matching_extras = ContentNodeExtras.objects.filter(tags__tag_name=tag)
        queryset = queryset & ContentNode.objects.filter_by_uuids(
            matching_extras, validate=False
        )
        return Response(self.serialize(queryset))
