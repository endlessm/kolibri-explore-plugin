#!/bin/bash
#
# Setup Project

set -e

# Argument parsing
pipenv_install_args=()
skip_nodeenv=false

while :; do
  case $1 in
    --ci)
      # Prevent the Pipfile.lock from being updated automatically. Just use
      # the pinned dependencies.
      pipenv_install_args+=( "--ignore-pipfile" )
      # And assume that node has already been set up, as the CI system can
      # cache that.
      skip_nodeenv=true
      ;;
    -h|-\?|--help|-?*)
      echo "Usage: bootstrap.sh [--ci]" >&2
      exit
      ;;
    *)
      break
  esac

  shift
done

# Install things
pipenv install --dev --deploy "${pipenv_install_args[@]}"
$skip_nodeenv || pipenv run nodeenv -p --node=16.14.0
pipenv run npm install -g yarn@1.22.19
pipenv run yarn install --ignore-engines
