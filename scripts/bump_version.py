#!/usr/bin/env python
import re
import subprocess
import sys

from bumpversion.cli import main
from bumpversion.vcs import Git

usage_message = """

Usage: bump_version [minor|major] [VERSION_NAME]

Please provide VERSION_NAME when bumping to 'major'. Otherwise you can
bump to 'minor'.

"""


def _update_version_name(version_name):
    print(f"Commiting new version name: {version_name}")
    with open("VERSION", "w") as fd:
        fd.write(version_name.strip() + "\n")
    subprocess.check_output(["git", "add", "--update", "VERSION"])
    subprocess.check_output(["git", "commit", "--message", "Update VERSION"])


if __name__ == "__main__":
    Git.assert_nondirty()

    if len(sys.argv) == 3:
        assert sys.argv[1] == "major", usage_message
        _update_version_name(sys.argv[2])
        # Remove version name to let bump2version work:
        del sys.argv[2]

    elif len(sys.argv) == 2:
        assert sys.argv[1] == "minor", usage_message
    else:
        raise AssertionError(usage_message)

    # Copied from bump2version script:
    sys.argv[0] = re.sub(r"(-script\.pyw|\.exe)?$", "", sys.argv[0])

    sys.exit(main())
