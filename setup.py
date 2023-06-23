#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

from setuptools import setup

import kolibri_explore_plugin


dist_name = "kolibri_explore_plugin"
# Default description of the distributed package
description = """Kolibri plugin for Endless custom presentation"""

# Use README.md as the long description
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

setup(
    name=dist_name,
    description=description,
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Endless OS Foundation",
    author_email="key@endlessos.org",
    url="https://github.com/endlessm/kolibri-explore-plugin",
    packages=["kolibri_explore_plugin"],
    entry_points={
        "kolibri.plugins": "kolibri_explore_plugin = kolibri_explore_plugin",
    },
    package_dir={"kolibri_explore_plugin": "kolibri_explore_plugin"},
    include_package_data=True,
    license="MIT",
    zip_safe=False,
    keywords="kolibri",
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.3",
        "Programming Language :: Python :: 3.4",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: Implementation :: PyPy",
    ],
)
