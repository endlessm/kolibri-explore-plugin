# Django settings for testing.
#
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
from kolibri.deployment.default.settings.test import *  # noqa: F401, F403

# Stub out Django logging as it's already handled by pytest.
LOGGING = {"version": 1}
