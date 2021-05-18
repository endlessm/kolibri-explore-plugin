#!/usr/bin/env python
import argparse

from _common import set_channel_override

parser = argparse.ArgumentParser(
    description="Set the channel override to default.",
)
parser.parse_args()
set_channel_override()
