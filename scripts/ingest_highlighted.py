#!/usr/bin/env python
# Copyright 2022 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import csv
import json
import os
from binascii import Error as BinasciiError
from binascii import unhexlify
from enum import IntEnum

import requests
from _common import HIGHLIGHTED_CONTENT_PATH


URL_TEMPLATE = (
    "https://docs.google.com/spreadsheets/d/{key}/"
    + "gviz/tq?tqx=out:csv&sheet={sheet}&range={range}"
)
URL_PARAMS = {
    "key": os.getenv("CONTENT_SPREADSHEET_KEY") or "XXX_MISSING_KEY",
    "sheet": "HIGHLIGHTS",
    "range": "A:B",
}


# Spreadsheet columns:
class Columns(IntEnum):
    TITLE = 0
    ID = 1


def get_rows_from_sheet():
    """Helper function to extract the data from the spreadsheet"""
    url = URL_TEMPLATE.format(**URL_PARAMS)
    response = requests.get(url)
    response.raise_for_status()

    def strip_row_text(row):
        return row[Columns.TITLE].strip(), row[Columns.ID].strip()

    def is_row_uncommented(row):
        return not row[Columns.TITLE].strip().startswith("#")

    csv_iterator = csv.reader(response.text.splitlines())
    return filter(is_row_uncommented, map(strip_row_text, csv_iterator))


def parse_set(rows_iterator):
    """Parse IDs until a row has the '----' delimiter."""
    ids = []
    for row in rows_iterator:
        if row[Columns.TITLE].startswith("----"):
            return ids
        # Ignore invalid IDs:
        if is_valid_id(row[Columns.ID]):
            ids.append(row[Columns.ID])
    return ids


def is_valid_id(node_id_string):
    """True if the ID is hexadecimal and with corresponding length."""
    try:
        node_id_binary = unhexlify(node_id_string)
        return len(node_id_binary) == 16
    except BinasciiError:
        print(f"Invalid node ID: {node_id_string}")
        return False


def parse_and_validate_channel_id(rows_iterator):
    """Parse next row assumming it's a channel set header.

    If the ID does not validate, stop parsing.  The channel IDs are
    the only ones that must be valide.  Other IDs will be ignored.
    """
    channel_id = next(rows_iterator)[Columns.ID]
    if not is_valid_id(channel_id):
        raise Exception("Invalid channel ID.")
    return channel_id


def parse_rows(rows_iterator):
    output = {
        # Special key for highlighted content in the Discovery page.
        # The other keys are channel IDs.
        "DISCOVERY": [],
    }

    # Skip first line, it's the table header:
    next(rows_iterator)

    # Parse highlighted content for Discovery:
    output["DISCOVERY"] = parse_set(rows_iterator)

    # Parse highlighted content per channel:
    while True:
        try:
            channel_id = parse_and_validate_channel_id(rows_iterator)
            output[channel_id] = parse_set(rows_iterator)
        except StopIteration:
            break
    return output


rows_iterator = get_rows_from_sheet()
output = parse_rows(rows_iterator)

# ## For debugging:
# from pprint import pprint
# pprint(output)

with open(HIGHLIGHTED_CONTENT_PATH, "w") as output_file:
    json.dump(output, output_file)
