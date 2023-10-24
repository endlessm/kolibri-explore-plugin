#!/usr/bin/env python3
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import os
from argparse import ArgumentParser
from pathlib import Path
from tempfile import TemporaryDirectory

from kolibri_explore_plugin.test.utils import create_contentdir

SRCDIR = Path(__file__).parent.parent
CHANNELSDIR = SRCDIR / "kolibri_explore_plugin/test/channels"


def main():
    ap = ArgumentParser(description="Create channel database from JSON")
    ap.add_argument(
        "contentdir",
        metavar="CONTENTDIR",
        type=Path,
        help="content output directory",
    )
    ap.add_argument(
        "-c",
        "--channelsdir",
        metavar="CHANNELSDIR",
        type=Path,
        default=CHANNELSDIR,
        help="test channels directory (default: %(default)s)",
    )
    args = ap.parse_args()

    # Unfortunately, sqlalchemybridge can't be used without an initialized
    # Kolibri homedir, so make a temporary one.
    with TemporaryDirectory(prefix="kolibri-home-") as kolibri_home:
        os.environ["KOLIBRI_HOME"] = kolibri_home
        from kolibri.main import initialize

        initialize()
        create_contentdir(args.contentdir, args.channelsdir)


if __name__ == "__main__":
    main()
