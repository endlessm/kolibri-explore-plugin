#!/usr/bin/env python
# Copyright 2021 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import functools
import json
import random

random.seed("generate reproducible random values")

nodes_config = [
    # level 0
    {
        "topic": 3,  # main topics
    },
    # 1st level
    {
        "topic": 6,  # subtopics
    },
    # 2nd level
    {
        "topic": 2,
    },
    # 3rd level
    {
        "video": 9,
    },
]


def random_hash():
    return "%032x" % random.randrange(16**32)


def topic_title(level, number):
    if level == 0:
        return f"Main Topic #{number+1}"
    elif level == 1:
        return f"Subtopic #{number+1}"
    else:
        return f"Topic #{level}-{number+1}"


def title(kind, level, number):
    return f"{kind.title()} #{level}-{number+1}"


channel_title = "Test Channel"
channel_hash = random_hash()

lang = {
    "id": "en",
    "lang_code": "en",
    "lang_subcode": None,
    "lang_name": "English",
    "lang_direction": "ltr",
}

channel = {
    "id": channel_hash,
    "title": channel_title,
    "description": "Testing custom channel presentation.",
    "tagline": None,
    "root_id": channel_hash,
    "last_updated": "2020-08-27T20:29:36.115865-03:00",
    "version": 1,
    "thumbnail": "",
    "num_coach_contents": 0,
}

root_node = {
    "id": channel_hash,
    "title": channel_title,
    "author": "",
    "available": True,
    "channel_id": channel_hash,
    "coach_content": False,
    "content_id": channel_hash,
    "description": "",
    "kind": "topic",
    "license_description": None,
    "license_name": None,
    "license_owner": "",
    "num_coach_contents": 0,
    "options": {},
    "parent": None,
    "sort_order": 24223,
    "lang": lang,
    "assessmentmetadata": None,
    "files": [],
}

description = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus
quis justo in semper. Nunc nulla nisl, semper vitae est at, faucibus
dictum dui. Sed faucibus volutpat congue. Donec auctor tellus nunc, id
tristique nisi porta ut. Nulla id convallis leo. Class aptent taciti
sociosqu ad litora torquent per conubia nostra, per inceptos
himenaeos. Duis cursus ligula vehicula rutrum euismod. Nam commodo
auctor velit, id varius tellus vestibulum eget. Praesent sit amet
facilisis arcu. Donec magna lectus, finibus nec arcu sed, iaculis
vulputate orci. Ut nisl leo, dictum ac risus sit amet, dapibus auctor
lorem. Nulla sed magna vel quam bibendum eleifend in eget lorem. Etiam
dapibus pharetra ex, et commodo mi elementum in. Nam imperdiet laoreet
nisi nec laoreet.
""".strip()

license_description = """
The Attribution-ShareAlike License lets others remix, tweak, and build
upon your work even for commercial purposes, as long as they credit
you and license their new creations under the identical terms. This
license is often compared to \"copyleft\" free and open source
software licenses. All new works based on yours will carry the same
license, so any derivatives will also allow commercial use. This is
the license used by Wikipedia, and is recommended for materials that
would benefit from incorporating content from Wikipedia and similarly
licensed projects.
""".strip()

license_name = "CC BY-SA"

license_owner = "Endless Foundation LLC"


def create_topic_node(level, number, parent=channel_hash):
    return {
        "id": random_hash(),
        "author": "",
        "available": True,
        "channel_id": channel_hash,
        "coach_content": False,
        "content_id": random_hash(),
        "description": description,
        "kind": "topic",
        "license_description": license_description,
        "license_name": license_name,
        "license_owner": license_owner,
        "num_coach_contents": 0,
        "options": {},
        "parent": parent,
        "sort_order": number,
        "title": topic_title(level, number),
        "lang": lang,
        "assessmentmetadata": None,
        "files": [],
    }


def create_leaf_node(level, number, parent=channel_hash, kind="video"):
    return {
        "id": random_hash(),
        "author": "",
        "available": True,
        "channel_id": channel_hash,
        "coach_content": False,
        "content_id": random_hash(),
        "description": description,
        "kind": kind,
        "license_description": license_description,
        "license_name": license_name,
        "license_owner": license_owner,
        "num_coach_contents": 0,
        "options": {},
        "parent": parent,
        "sort_order": number,
        "title": title(kind, level, number),
        "lang": lang,
        "assessmentmetadata": None,
        "files": [],
        # "thumbnail": ...
    }


all_nodes = [root_node]


def create_nodes(parent_nodes, level=0):
    if level >= len(nodes_config):
        return
    for parent in parent_nodes:
        for kind, total in nodes_config[level].items():
            fn = None
            if kind == "topic":
                fn = create_topic_node
            else:
                fn = functools.partial(create_leaf_node, kind=kind)
            nodes = [
                fn(level, number, parent["id"]) for number in range(total)
            ]
            all_nodes.extend(nodes)
            if kind == "topic" and nodes:
                create_nodes(nodes, level + 1)


create_nodes([root_node])

obj = {
    "channel": channel,
    "nodes": all_nodes,
}

print(json.dumps(obj))
