#!/usr/bin/env python
import argparse

from _common import set_channel_override


parser = argparse.ArgumentParser(
    description="Check if there is a channel override. "
    "Set to default if not.",
)
parser.parse_args()
set_channel_override(ensure=True)
