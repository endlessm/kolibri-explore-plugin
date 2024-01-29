# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from django.conf.urls import include
from django.conf.urls import url
from rest_framework import routers

from .collectionviews import cancel_download
from .collectionviews import current_collection_exists
from .collectionviews import get_all_collections_info
from .collectionviews import get_collection_info
from .collectionviews import get_download_status
from .collectionviews import get_should_resume
from .collectionviews import resume_download
from .collectionviews import start_download
from .collectionviews import update_download
from .viewsets import ContentNodeExtrasViewset
from .viewsets import ExploreChannelMetadataViewSet
from .viewsets import ExploreContentNodeViewset
from .viewsets import ExternalContentTagViewset


router = routers.SimpleRouter()

router.register(r"channel", ExploreChannelMetadataViewSet, basename="channel")
router.register(
    r"contentnode",
    ExploreContentNodeViewset,
    basename="contentnode",
)
router.register(
    r"externalcontenttag",
    ExternalContentTagViewset,
    basename="externalcontenttag",
)
router.register(
    r"contentnodeextras",
    ContentNodeExtrasViewset,
    basename="contentnodeextras",
)

urlpatterns = [
    url(r"^", include(router.urls)),
    url(
        r"ek-collections/current-collection-exists",
        current_collection_exists,
        name="current_collection_exists",
    ),
    url(
        r"ek-collections/get-collection-info",
        get_collection_info,
        name="get_collection_info",
    ),
    url(
        r"ek-collections/get-all-collections-info",
        get_all_collections_info,
        name="get_all_collections_info",
    ),
    url(
        r"ek-collections/get-should-resume",
        get_should_resume,
        name="get_should_resume",
    ),
    url(
        r"ek-collections/start-download",
        start_download,
        name="start_download",
    ),
    url(
        r"ek-collections/resume-download",
        resume_download,
        name="resume_download",
    ),
    url(
        r"ek-collections/update-download",
        update_download,
        name="update_download",
    ),
    url(
        r"ek-collections/cancel-download",
        cancel_download,
        name="cancel_download",
    ),
    url(
        r"ek-collections/get-download-status",
        get_download_status,
        name="get_download_status",
    ),
]
