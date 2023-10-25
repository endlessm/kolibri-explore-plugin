# Pytest plugin for Kolibri integrating with pytest-django.
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import logging
import os
from tempfile import TemporaryDirectory

import pytest
from pytest_django.plugin import SETTINGS_MODULE_ENV

logger = logging.getLogger(__name__)

_kolibri_home = None
_report_header_messages = []


def _setup_kolibri():
    """Setup a Kolibri homedir for testing"""
    global _kolibri_home
    if _kolibri_home:
        return

    # Clear all Kolibri environment variables.
    for var in os.environ:
        if var.startswith("KOLIBRI_"):
            del os.environ[var]

    # Create the homedir and set the environment variable.
    _kolibri_home = TemporaryDirectory(prefix="kolibri-home-")
    _report_header_messages.append(f"kolibri_home: {_kolibri_home.name}")
    os.environ["KOLIBRI_HOME"] = _kolibri_home.name

    # Default to our settings module.
    os.environ.setdefault(
        SETTINGS_MODULE_ENV,
        "kolibri_explore_plugin.test.settings",
    )

    # Stub out Kolibri's logging setup setup so it doesn't interfere
    # with pytest's.
    def empty_logging_config(*args, **kwargs):
        return {"version": 1}

    import kolibri.utils.logger

    kolibri.utils.logger.get_default_logging_config = empty_logging_config

    # Enable our plugin and initialize the homedir.
    from kolibri.main import initialize
    from kolibri.plugins import config
    from kolibri.utils.conf import OPTIONS

    config["INSTALLED_PLUGINS"].add("kolibri_explore_plugin")
    initialize()

    # Always set a non-production run mode and disable pings so that they don't
    # hang and interfere with other tasks.
    OPTIONS["Deployment"]["RUN_MODE"] = "test"
    OPTIONS["Deployment"]["DISABLE_PING"] = True


@pytest.hookimpl(tryfirst=True)
def pytest_load_initial_conftests(early_config, parser, args):
    """Hook to configure conftests

    This is called before option parsing. tryfirst is needed so that it
    runs before the equivalent hook in pytest-django. That's required so
    that Kolibri can initialize Django instead of pytest-django.
    """
    options = parser.parse_known_args(args)
    if options.version or options.help:
        return

    settings = options.ds
    if not settings:
        settings = os.getenv(SETTINGS_MODULE_ENV)
    if not settings:
        settings = early_config.getini(SETTINGS_MODULE_ENV)

    if not settings:
        return

    # Set the DJANGO_SETTINGS_MODULE environment variable so that
    # pytest-django skips its initialization.
    os.environ[SETTINGS_MODULE_ENV] = settings

    _setup_kolibri()


def pytest_configure(config):
    """Hook to perform initial configuration

    This is likely a no-op since the load_initial_conftests hook does
    the same thing earlier.
    """
    _setup_kolibri()


def pytest_unconfigure(config):
    """Hook called before the test process is exited"""
    global _kolibri_home

    # Delete the temporary Kolibri homedir.
    if _kolibri_home:
        _kolibri_home.cleanup()
        _kolibri_home = None


def pytest_report_header():
    """Messages to be displayed by pytest"""
    return _report_header_messages
