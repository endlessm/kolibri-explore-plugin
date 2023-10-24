#!/usr/bin/env python3
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import json
import sys
from argparse import ArgumentParser
from base64 import b64encode
from hashlib import md5
from pathlib import Path
from random import randbytes
from random import randint
from uuid import uuid4

SRCDIR = Path(__file__).parent.parent
CHANNELSDIR = SRCDIR / "kolibri_explore_plugin/test/channels"


def random_id():
    """Create a random UUID4 ID"""
    return str(uuid4().hex)


def random_b64(size):
    """Create random base64 encoded data"""
    return b64encode(randbytes(size)).decode("ascii")


def generate_channel():
    """Generate channel parameters"""
    channel_id = random_id()
    return {
        "id": channel_id,
        "root_id": channel_id,
        "thumbnail": f"data:image/jpg;base64,{random_b64(30)}",
        "version": randint(1, 4),
    }


def generate_nodes(channel):
    """Generate content node parameters"""
    root = {
        "id": channel["root_id"],
        "channel_id": channel["id"],
        "content_id": channel["root_id"],
        "parent_id": None,
    }
    topic_id = random_id()

    def root_node(node_id=None):
        if node_id is None:
            node_id = random_id()
        return {
            "id": node_id,
            "channel_id": channel["id"],
            "content_id": random_id(),
            "parent_id": root["id"],
        }

    def topic_node():
        return {
            "id": random_id(),
            "channel_id": channel["id"],
            "content_id": random_id(),
            "parent_id": topic_id,
        }

    return [
        root,
        root_node(),
        root_node(topic_id),
        topic_node(),
        topic_node(),
        topic_node(),
    ]


def generate_localfiles():
    """Generate content localfile parameters"""

    def localfile():
        size = randint(1, 30)
        content = randbytes(size)
        content_b64 = b64encode(content).decode("ascii")
        checksum = md5(content).hexdigest()
        return {
            "id": checksum,
            "file_size": size,
            "_content": content_b64,
        }

    return [localfile() for _ in range(10)]


def generate_files(nodes, localfiles):
    """Generate content file parameters"""

    def node_file(node, localfile):
        return {
            "id": random_id(),
            "contentnode_id": node["id"],
            "local_file_id": localfile["id"],
        }

    return [
        node_file(nodes[1], localfiles[0]),
        node_file(nodes[1], localfiles[1]),
        node_file(nodes[1], localfiles[2]),
        node_file(nodes[1], localfiles[3]),
        node_file(nodes[2], localfiles[4]),
        node_file(nodes[3], localfiles[5]),
        node_file(nodes[3], localfiles[6]),
        node_file(nodes[4], localfiles[7]),
        node_file(nodes[4], localfiles[8]),
        node_file(nodes[5], localfiles[9]),
    ]


def generate_tags():
    """Generate content tag parameters"""
    return [{"id": random_id()} for _ in range(3)]


def generate_node_tags(nodes, tags):
    """Generate content node tag parameters"""

    def node_tag(node, tag):
        return {
            "contentnode_id": node["id"],
            "contenttag_id": tag["id"],
        }

    return [
        node_tag(nodes[0], tags[0]),
        node_tag(nodes[0], tags[1]),
        node_tag(nodes[0], tags[2]),
        node_tag(nodes[1], tags[0]),
        node_tag(nodes[2], tags[1]),
    ]


def generate_prerequisites(nodes):
    """Generate content node prerequisites parameters"""
    return [
        {
            "from_contentnode_id": nodes[1]["id"],
            "to_contentnode_id": nodes[0]["id"],
        },
    ]


def generate_related(nodes):
    """Generate content node related parameters"""
    return [
        {
            "from_contentnode_id": nodes[1]["id"],
            "to_contentnode_id": nodes[2]["id"],
        },
        {
            "from_contentnode_id": nodes[2]["id"],
            "to_contentnode_id": nodes[1]["id"],
        },
    ]


def generate_params():
    """Generate channel DB parameters"""
    channel = generate_channel()
    nodes = generate_nodes(channel)
    localfiles = generate_localfiles()
    files = generate_files(nodes, localfiles)
    tags = generate_tags()
    node_tags = generate_node_tags(nodes, tags)
    prerequisites = generate_prerequisites(nodes)
    related = generate_related(nodes)

    return {
        "channel": channel,
        "nodes": nodes,
        "files": files,
        "localfiles": localfiles,
        "tags": tags,
        "node_tags": node_tags,
        "prerequisites": prerequisites,
        "related": related,
    }


def substitute_params(data, params):
    """Substitute channel DB parameters in template data"""
    data["content_channelmetadata"][0].update(params["channel"])
    for index, node in enumerate(data["content_contentnode"]):
        node.update(params["nodes"][index])
    for index, file in enumerate(data["content_file"]):
        file.update(params["files"][index])
    for index, localfile in enumerate(data["content_localfile"]):
        localfile.update(params["localfiles"][index])
    for index, tag in enumerate(data["content_contenttag"]):
        tag.update(params["tags"][index])
    for index, node_tag in enumerate(data["content_contentnode_tags"]):
        node_tag.update(params["node_tags"][index])
    for index, prereq in enumerate(
        data["content_contentnode_has_prerequisite"]
    ):
        prereq.update(params["prerequisites"][index])
    for index, relation in enumerate(data["content_contentnode_related"]):
        relation.update(params["related"][index])


def main():
    ap = ArgumentParser(description="Create fake channel DB JSON")
    ap.add_argument(
        "-c",
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

    params = generate_params()
    template = args.channelsdir / "db.json.template"
    with open(template) as f:
        data = json.load(f)
    substitute_params(data, params)

    if args.dry_run:
        json.dump(data, sys.stdout, indent=2)
    else:
        channel_id = params["channel"]["id"]
        path = args.channelsdir / f"{channel_id}.json"
        print(f"Creating {channel_id} database JSON {path}")
        with open(path, "w") as f:
            json.dump(data, f, indent=2)


if __name__ == "__main__":
    main()
