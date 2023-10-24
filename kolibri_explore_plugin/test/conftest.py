# pytest fixtures
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import pytest
from django.core.management import call_command

from .utils import create_contentdir


@pytest.fixture
def content_data(db):
    """Load test content database fixture"""
    call_command("loaddata", "test-content.json")


@pytest.fixture(scope="session")
def serverdir(tmp_path_factory):
    """Session scoped server root directory"""
    return tmp_path_factory.mktemp("server")


@pytest.fixture(scope="session")
def contentdir(serverdir):
    """Session scoped server content directory"""
    contentdir = serverdir / "content"
    create_contentdir(contentdir)
    return contentdir
