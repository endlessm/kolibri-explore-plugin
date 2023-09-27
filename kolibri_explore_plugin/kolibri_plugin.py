# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

from django.urls import reverse
from kolibri.core.auth.constants.user_kinds import ANONYMOUS
from kolibri.core.auth.constants.user_kinds import LEARNER
from kolibri.core.content.hooks import ContentNodeDisplayHook
from kolibri.core.device.utils import is_landing_page
from kolibri.core.device.utils import LANDING_PAGE_LEARN
from kolibri.core.hooks import NavigationHook
from kolibri.core.hooks import RoleBasedRedirectHook
from kolibri.core.tasks.hooks import StorageHook
from kolibri.core.webpack import hooks as webpack_hooks
from kolibri.plugins import KolibriPluginBase
from kolibri.plugins.hooks import register_hook
from kolibri.utils import conf


class Explore(KolibriPluginBase):
    translated_view_urls = "urls"
    untranslated_view_urls = "api_urls"
    can_manage_while_running = True
    kolibri_options = "options"

    @property
    def url_slug(self):
        return r"explore/"


@register_hook
class ExploreRedirect(RoleBasedRedirectHook):
    @property
    def roles(self):
        if is_landing_page(LANDING_PAGE_LEARN):
            return (ANONYMOUS, LEARNER)

        return (LEARNER,)

    @property
    def url(self):
        return self.plugin_url(Explore, "explore")


@register_hook
class ExploreNavItem(NavigationHook):
    bundle_id = "side_nav"


@register_hook
class ExploreAsset(webpack_hooks.WebpackBundleHook):
    bundle_id = "app"

    @property
    def plugin_data(self):
        options = {
            "showAsStandaloneChannel": conf.OPTIONS["Explore"][
                "SHOW_AS_STANDALONE_CHANNEL"
            ],
            "useEkIguanaPage": conf.OPTIONS["Explore"]["USE_EK_IGUANA_PAGE"],
            "enableSideNav": conf.OPTIONS["Explore"]["ENABLE_SIDE_NAV"],
            "hideDiscoveryTab": conf.OPTIONS["Explore"]["HIDE_DISCOVERY_TAB"],
            "feedbackUrl": conf.OPTIONS["Explore"]["FEEDBACK_URL"],
            "feedbackUrlEs": conf.OPTIONS["Explore"]["FEEDBACK_URL_ES"],
        }
        if "Pwa" in conf.OPTIONS:
            pwa_options = {
                # Use the app IDs from the PWA plugin, which advertises them as
                # related applications.
                "androidApplicationId": conf.OPTIONS["Pwa"][
                    "ANDROID_APPLICATION_ID"
                ],
                "windowsApplicationId": conf.OPTIONS["Pwa"][
                    "WINDOWS_APPLICATION_ID"
                ],
            }
            options.update(pwa_options)
        return options


@register_hook
class ExploreContentNodeHook(ContentNodeDisplayHook):
    def node_url(self, node):
        kind_slug = None
        if not node.parent:
            kind_slug = ""
        elif node.kind == "topic":
            kind_slug = "t/"
        else:
            kind_slug = "c/"
        if kind_slug is not None:
            return (
                reverse("kolibri:kolibri_explore_plugin:explore")
                + "#/topics/"
                + kind_slug
                + node.id
            )


@register_hook
class ExploreStorageHook(StorageHook):
    """Job storage hooks"""

    def schedule(self, job, orm_job):
        pass

    def update(self, *args, **kwargs):
        from .jobs import storage_update_hook

        storage_update_hook(*args, **kwargs)

    def clear(self, job, orm_job):
        pass
