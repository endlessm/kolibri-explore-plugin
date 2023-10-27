#!/usr/bin/env python3
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import json
import sys
from argparse import ArgumentParser
from pathlib import Path

SRCDIR = Path(__file__).parent.parent
CHANNELSDIR = SRCDIR / "kolibri_explore_plugin/test/channels"
COLLECTIONSDIR = SRCDIR / "kolibri_explore_plugin/test/collections"


def generate_params(name, version, channel_ids):
    """Generate collection pack parameters"""
    metadata = {
        "title": name.title(),
        "subtitle": version,
        "description": name,
    }

    channels = []
    tagged_nodes = []
    for index, channel_id in enumerate(channel_ids):
        channel_path = CHANNELSDIR / f"{channel_id}.json"
        with open(channel_path) as f:
            channel_data = json.load(f)

        channels.append(
            {
                "id": channel_id,
                "version": channel_data["content_channelmetadata"][0][
                    "version"
                ],
                "include_node_ids": [
                    channel_data["content_contentnode"][1]["id"],
                    channel_data["content_contentnode"][4]["id"],
                ],
            }
        )

        # Add the first channel root ID as the first tagged node.
        if index == 0:
            tagged_nodes.append(
                {
                    "node_id": channel_data["content_channelmetadata"][0][
                        "root_id"
                    ],
                }
            )
        tagged_nodes += [
            {
                "node_id": channel_data["content_contentnode"][1]["id"],
            },
            {
                "node_id": channel_data["content_contentnode"][4]["id"],
            },
        ]

    return {
        "metadata": metadata,
        "channels": channels,
        "tagged_nodes": tagged_nodes,
    }


def substitute_params(data, params):
    """Substitute pack parameters in template data"""
    data["metadata"].update(params["metadata"])
    for index, entry in enumerate(data["channels"]):
        entry.update(params["channels"][index])
    for index, entry in enumerate(data["metadata"]["tagged_node_ids"]):
        entry.update(params["tagged_nodes"][index])


def main():
    ap = ArgumentParser(description="Create fake channel DB JSON")
    ap.add_argument(
        "name",
        metavar="NAME",
        help="collection pack name (e.g., artist)",
    )
    ap.add_argument(
        "version",
        metavar="VERSION",
        help="collection pack version (e.g., 0001)",
    )
    ap.add_argument(
        "channels",
        metavar="CHANNEL",
        nargs=2,
        help="channel IDs",
    )
    ap.add_argument(
        "-c",
        "--collectionsdir",
        metavar="COLLECTIONSDIR",
        type=Path,
        default=COLLECTIONSDIR,
        help="test collections directory (default: %(default)s)",
    )
    ap.add_argument(
        "--channelsdir",
        metavar="CHANNELSDIR",
        type=Path,
        default=CHANNELSDIR,
        help="test channels directory (default: %(default)s)",
    )
    ap.add_argument(
        "-n",
        "--dry-run",
        action="store_true",
        help="only show the generated JSON",
    )
    args = ap.parse_args()

    params = generate_params(args.name, args.version, args.channels)
    template = args.collectionsdir / "pack.json.template"
    with open(template) as f:
        data = json.load(f)
    substitute_params(data, params)

    if args.dry_run:
        json.dump(data, sys.stdout, indent=2)
    else:
        path = args.collectionsdir / f"{args.name}-{args.version}.json"
        print(f"Creating {args.name}-{args.version} pack JSON {path}")
        with open(path, "w") as f:
            json.dump(data, f, indent=2)


if __name__ == "__main__":
    main()
