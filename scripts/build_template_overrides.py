#!/usr/bin/env python
import subprocess

from _common import bundle_zip
from _common import get_available_overrides
from _common import set_channel_override

for override in get_available_overrides():
    set_channel_override(override)
    subprocess.run(["vue-cli-service", "build"])
    bundle_zip(override)
