#!/usr/bin/env python
# Copyright 2021-2022 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import os
import subprocess
import zipfile
from pathlib import Path


PROJECT_DIR = subprocess.check_output(
    ["/usr/bin/git", "rev-parse", "--show-toplevel"],
    universal_newlines=True,
).strip()

PACKAGES_DIR = os.path.join(PROJECT_DIR, "packages")

TEMPLATE_WORKSPACE = "template-ui"

TEMPLATE_WORKSPACE_PATH = os.path.join(PACKAGES_DIR, TEMPLATE_WORKSPACE)

CHANNEL_OVERRIDES_DIR = os.path.join(
    TEMPLATE_WORKSPACE_PATH, "channel-overrides"
)

OVERRIDES_PATH = os.path.join(TEMPLATE_WORKSPACE_PATH, "src", "overrides")

DEFAULT_OVERRIDE = "default"

DEFAULT_OVERRIDE_PATH = os.path.join(CHANNEL_OVERRIDES_DIR, DEFAULT_OVERRIDE)

DEFAULT_ZIP_NAME = "custom-channel-ui"

HIGHLIGHTED_CONTENT_PATH = os.path.join(
    PROJECT_DIR, "kolibri_explore_plugin", "static", "highlighted-content.json"
)

BUNDLE_EXCLUDE_GLOBS = ["*.map"]


def bundle_zip(zip_name, compression=zipfile.ZIP_DEFLATED):
    root_path = Path("dist")

    if not zip_name.endswith(".zip"):
        zip_name = zip_name + ".zip"

    with zipfile.ZipFile(zip_name, "w", compression=compression) as bundle:
        for path in root_path.glob("**/*"):
            if not any(path.match(glob) for glob in BUNDLE_EXCLUDE_GLOBS):
                bundle.write(path, path.relative_to(root_path))

    print(f"File ./{zip_name} created.")


def get_available_overrides():
    return sorted(os.listdir(CHANNEL_OVERRIDES_DIR))


def get_override_path(override):
    return os.path.join(CHANNEL_OVERRIDES_DIR, override)


def set_channel_override(channel_override=DEFAULT_OVERRIDE, ensure=False):
    if os.path.exists(OVERRIDES_PATH):
        if ensure:
            return
        os.remove(OVERRIDES_PATH)
    os.symlink(get_override_path(channel_override), OVERRIDES_PATH)
