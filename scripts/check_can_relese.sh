#!/bin/bash -e
#
# Check that all is pushed so it's ready to release
HEAD=$(git rev-parse --verify HEAD)
TAG=$(git describe --tags)
MASTER_HASH=$(git ls-remote https://github.com/endlessm/kolibri-explore-plugin.git master | cut -f1)
if [ $HEAD != $MASTER_HASH ]
then
    echo "The repository is not pushed"
    exit 1
fi

TAG_HASH=$(git ls-remote https://github.com/endlessm/kolibri-explore-plugin.git $TAG^{} | cut -f1)
if [[ -z $TAG_HASH || $TAG_HASH != $MASTER_HASH ]]
then
    echo "The tag is not updated or it's not the latest commit in master"
    exit 1
fi

exit 0
