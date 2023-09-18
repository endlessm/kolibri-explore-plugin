#!/usr/bin/env python
# Copyright 2022-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import os.path
import subprocess
import sys
from argparse import ArgumentParser

from bumpversion.cli import main
from bumpversion.vcs import Git

VERSION_FILENAME = os.path.join("kolibri_explore_plugin", "VERSION")


def _update_version_name(version_name):
    with open(VERSION_FILENAME, "r") as fd:
        current_name = fd.read().strip()
    if current_name == version_name.strip():
        return

    print(f"Committing new version name: {version_name}")
    with open(VERSION_FILENAME, "w") as fd:
        fd.write(version_name.strip() + "\n")
    subprocess.check_output(["git", "add", "--update", VERSION_FILENAME])
    subprocess.check_output(["git", "commit", "--message", "Update VERSION"])


if __name__ == "__main__":
    ap = ArgumentParser(
        description="Bump plugin version number",
        epilog="All other options will be passed to bumpversion.",
    )
    ap.add_argument(
        "part",
        metavar="PART",
        choices=("major", "minor", "rc"),
        help="Part of the version number to be bumped",
    )
    ap.add_argument(
        "version_name",
        metavar="VERSION_NAME",
        nargs="?",
        help="Version name required for major version bumps",
    )
    args, remaining = ap.parse_known_args()

    Git.assert_nondirty()

    if args.part == "major":
        if not args.version_name:
            ap.error("VERSION_NAME is required for a major release")
        _update_version_name(args.version_name)

    bumpversion_args = [args.part] + remaining
    sys.exit(main(bumpversion_args))
