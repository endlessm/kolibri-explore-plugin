#!/usr/bin/env python
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

# Connect to the database:
db_path = os.path.join(kolibri_home, "db.sqlite3")
connection = sqlite3.connect(db_path)
cursor = connection.cursor()

# Load content IDs from json file:
content_ids = None
with open(HIGHLIGHTED_CONTENT_PATH, "r") as input_file:
    data = json.load(input_file)
    content_ids = list(chain.from_iterable(data.values()))

# Output error for each content ID not found in the database:
query = "SELECT title FROM content_contentnode WHERE id = ?"
for content_id in content_ids:
    cursor.execute(query, (content_id,))
    exists = len(cursor.fetchall()) > 0
    if not exists:
        print(f"ID not found in database: {content_id}")
