# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from django.apps import AppConfig


class ExploreConfig(AppConfig):
    name = "kolibri_explore_plugin"
    label = "explore"

    def ready(self):
        from .tasks import restart_failed_background_jobs

        restart_failed_background_jobs()
