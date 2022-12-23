#!/bin/bash

HEAD=$(git rev-parse --verify HEAD --short)
DATE=$(TZ=UTC git show --quiet --date=local --format="%cd")
VERSION_NAME=$(cat kolibri_explore_plugin/VERSION)
LAST_RELEASE=$(git describe --tags $(git rev-list --tags --max-count=1))
COMMITS=$(git log --no-merges --pretty=format:'%h|%s|%aN' $LAST_RELEASE..HEAD)

echo '{
    "commit": "'$HEAD'",
    "date": "'$DATE'",
    "version_name": "'$VERSION_NAME'",
    "last_release": "'$LAST_RELEASE'",
    "log": ['

NOTFIRST=false
while read -r line
do
    commit=$(echo $line | cut -d"|" -f1)
    subject=$(echo $line | cut -d"|" -f2 | sed 's/"/\\"/g')
    author=$(echo $line | cut -d"|" -f3)

    if $NOTFIRST
    then
        echo ','
    fi
    echo -n '{ "commit": "'$commit'", "subject": "'$subject'", "author": "'$author'" }'
    NOTFIRST=true
done <<< $COMMITS

echo ']}'
