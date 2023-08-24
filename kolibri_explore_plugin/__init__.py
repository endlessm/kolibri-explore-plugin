# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
try:
    from ._version import __version__  # noqa: F401
except ModuleNotFoundError:
    __version__ = "0.dev0"

default_app_config = "kolibri_explore_plugin.apps_config.ExploreConfig"
