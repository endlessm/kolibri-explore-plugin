#!/usr/bin/env python
# Copyright 2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later
import argparse
import csv
import json


def _update_translation(csv_path, json_path):
    json_data = {}
    with open(json_path) as json_file:
        json_data = json.load(json_file)

    csv_data = []
    with open(csv_path, encoding="utf8") as csv_file:
        csv_reader = csv.reader(csv_file)
        for row in csv_reader:
            csv_data.append(row)

    csv_data.pop(0)  # first line is header

    total_missing = 0
    for i, row in enumerate(csv_data):
        _id = csv_data[i][0]
        translation = csv_data[i][3].strip()
        if _id in json_data:
            if translation == "":
                # Ignore missing ones
                continue
            json_data[_id] = translation
        else:
            print(f"Missing ID: {_id}")
            total_missing += 1

    with open(json_path, "w", encoding="utf8") as json_file:
        json.dump(
            json_data, json_file, ensure_ascii=False, sort_keys=True, indent=2
        )

    print(f"Total Missing: {total_missing}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Update a JSON locale file from a CSV file."
    )
    parser.add_argument(
        "csv_path", help="Path to CSV file to use as source.", type=str
    )
    parser.add_argument(
        "json_path", help="Path to JSON file to update.", type=str
    )

    args = vars(parser.parse_args())
    _update_translation(**args)
