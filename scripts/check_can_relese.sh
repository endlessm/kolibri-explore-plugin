#!/bin/bash -e
#
# Check that all is pushed so it's ready to release
HEAD=$(git rev-parse --verify HEAD)
TAG=$(git describe --tags)
STABLE_HASH=$(git ls-remote https://github.com/endlessm/kolibri-explore-plugin.git stable | cut -f1)
if [ $HEAD != $STABLE_HASH ]
then
    echo "The repository is not pushed"
    exit 1
fi

TAG_HASH=$(git ls-remote https://github.com/endlessm/kolibri-explore-plugin.git $TAG^{} | cut -f1)
if [[ -z $TAG_HASH || $TAG_HASH != $STABLE_HASH ]]
then
    echo "The tag is not updated or it's not the latest commit in stable"
    exit 1
fi

exit 0
