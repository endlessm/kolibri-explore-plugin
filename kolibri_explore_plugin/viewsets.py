# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control
from django.views.decorators.http import etag
from kolibri.core.api import ReadOnlyValuesViewset
from kolibri.core.content.api import ChannelMetadataViewSet
from kolibri.core.content.api import ContentNodeViewset
from kolibri.core.content.api import get_cache_key
from kolibri.core.content.models import ContentNode
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ContentNodeExtras
from .models import ExternalContentTag

cache_key_etag_decorators = (
    etag(get_cache_key),
    cache_control(no_cache=True),
)


class ExternalContentTagViewset(ReadOnlyValuesViewset):
    values = ("id", "tag_name")

    def get_queryset(self):
        return ExternalContentTag.objects.all()


@method_decorator(cache_key_etag_decorators, name="dispatch")
class ExploreChannelMetadataViewSet(ChannelMetadataViewSet):
    # Override the dispatch method so that the metadata_cache decorated
    # dispatch from ChannelMetadataViewSet isn't used.
    def dispatch(self, *args, **kwargs):
        return ReadOnlyValuesViewset.dispatch(self, *args, **kwargs)


@method_decorator(cache_key_etag_decorators, name="dispatch")
class ExploreContentNodeViewset(ContentNodeViewset):
    # Override the dispatch method so that the metadata_cache decorated
    # dispatch from ContentNodeViewset isn't used.
    def dispatch(self, *args, **kwargs):
        return ReadOnlyValuesViewset.dispatch(self, *args, **kwargs)


class ContentNodeExtrasViewset(ContentNodeViewset):
    @action(detail=False)
    def by_external_tag(self, request):
        tag = self.request.query_params.get("tag", None)
        queryset = self.filter_queryset(self.get_queryset())
        matching_extras = ContentNodeExtras.objects.filter(tags__tag_name=tag)
        queryset = queryset & ContentNode.objects.filter_by_uuids(
            matching_extras, validate=False
        )

        only_root_nodes = self.request.query_params.get(
            "only_root_nodes", False
        )
        if only_root_nodes:
            queryset = queryset & ContentNode.objects.filter(
                parent__isnull=True
            )

        return Response(self.serialize(queryset))
