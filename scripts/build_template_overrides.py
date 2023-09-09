#!/usr/bin/env python
# Copyright 2021 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import subprocess
import zipfile

from _common import bundle_zip
from _common import get_available_overrides
from _common import set_channel_override

for override in get_available_overrides():
    set_channel_override(override)
    subprocess.run(["vue-cli-service", "build"])
    bundle_zip(override, compression=zipfile.ZIP_LZMA)
