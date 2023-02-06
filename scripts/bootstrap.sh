#!/bin/bash -e
#
# Setup Project

pipenv install
pipenv run nodeenv -p --node=16.14.0
pipenv run npm install -g yarn@1.22.19
pipenv run yarn global add @vue/cli@v4.5.15
pipenv run yarn install --ignore-engines
