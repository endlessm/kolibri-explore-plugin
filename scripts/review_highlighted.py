#!/usr/bin/env python
# Copyright 2022 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import argparse
import getpass
import json
import os
import sqlite3
from itertools import chain

from _common import HIGHLIGHTED_CONTENT_PATH

username = getpass.getuser()
kolibri_home = (
    f"/run/media/{username}/eoslive/KOLIBRI_DATA/preseeded_kolibri_home"
)

parser = argparse.ArgumentParser(
    description="Review the ingested highlighted content "
    "with a Kolibri Home database.",
)
parser.add_argument(
    "--list-rows",
    action="store_true",
    help="Also list the title and ID of existing content.",
)

args = vars(parser.parse_args())

# Connect to the database:
db_path = os.path.join(kolibri_home, "db.sqlite3")
connection = sqlite3.connect(db_path)
connection.row_factory = sqlite3.Row
cursor = connection.cursor()

# Load content IDs from json file:
content_ids = None
with open(HIGHLIGHTED_CONTENT_PATH, "r") as input_file:
    data = json.load(input_file)
    content_ids = list(chain.from_iterable(data.values()))

# Output error for each content ID not found in the database:
query = "SELECT title, id, available FROM content_contentnode WHERE id = ?"
for content_id in content_ids:
    cursor.execute(query, (content_id,))
    row = cursor.fetchone()
    if row is None:
        print(f"Error: ID not found in database: {content_id}")
    elif row["available"] != 1:
        print(
            f"Error: Content not available in database:"
            f" {row['title']} - {row['id']}"
        )
    elif args["list_rows"]:
        print(f"{row['title']} - {row['id']}")
