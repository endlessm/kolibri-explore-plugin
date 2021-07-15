#!/bin/bash -e
#
# Clean Project
rm -fr build/
rm -fr dist/
rm -fr dist-packages-cache/
rm -fr dist-packages-temp/
rm -fr *.egg-info
rm -fr .eggs
rm -fr .cache
find . -name '*.pyc' -exec rm -f {} +
find . -name '*.pyo' -exec rm -f {} +
find . -name '*~' -exec rm -f {} +
rm -fr kolibri_explore_plugin/static/kolibri_explore_plugin*
rm -fr kolibri_explore_plugin/static/build-info.json
rm -fr kolibri_explore_plugin/build
rm -fr kolibri_explore_plugin/__pycache__
rm -fr kolibri_explore_plugin/loadingScreen
