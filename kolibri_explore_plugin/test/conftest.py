# pytest fixtures
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import pytest
from django.core.management import call_command


@pytest.fixture
def content_data(db):
    """Load test content database fixture"""
    call_command("loaddata", "test-content.json")
