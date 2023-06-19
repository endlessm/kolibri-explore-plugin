#!/usr/bin/python3
# trigger_jenkins.py - Trigger Jenkins jobs through API
# Copyright 2023 Endless OS Foundation LLC
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
import logging
import os
import sys
import time
from argparse import ArgumentParser

import jenkins
import requests

# How long in seconds to wait for the queued job to start building
QUEUE_POLL_TIMEOUT = 30

logger = logging.getLogger(__name__)


class JenkinsError(Exception):
    """Errors from Jenkins builds"""

    def __init__(self, *args):
        self.msg = " ".join(map(str, args))

    def __str__(self):
        return str(self.msg)


class JenkinsAPI(jenkins.Jenkins):
    """Make Jenkins API requests

    Provide a helper for making Jenkins API HTTP requests. This simply
    wraps jenkins.Jenkins, which handles all the necessary
    authentication and CSRF tokens.
    """

    # Default Jenkins base URL. This is used if neither the jenkins_url
    # keyword parameter nor the JENKINS_URL enviornment variable are
    # set.
    JENKINS_URL = "https://ci.endlessos.org"

    def __init__(
        self, user=None, password=None, jenkins_url=None, debug=False
    ):
        self.debug = debug

        # Figure out the user
        self.user = user
        if self.user is None:
            # Try the environment variable
            self.user = os.getenv("JENKINS_USER")
            if self.user is None:
                raise JenkinsError("No API user provided")

        # Figure out the password
        self.password = password
        if self.password is None:
            # Try the environment variable
            self.password = os.getenv("JENKINS_PASSWORD")
            if self.password is None:
                raise JenkinsError("No API password provided")

        # Figure out the jenkins URL
        self.jenkins_url = jenkins_url
        if self.jenkins_url is None:
            # Try the environment variable
            self.jenkins_url = os.getenv("JENKINS_URL")
            if self.jenkins_url is None:
                self.jenkins_url = self.JENKINS_URL

        logger.debug('Using "%s" as jenkins URL', self.jenkins_url)

        # Enable debugging in requests if needed.
        if self.debug:
            from http.client import HTTPConnection

            HTTPConnection.debuglevel = 1
            requests_log = logging.getLogger("urllib3")
            requests_log.setLevel(logging.DEBUG)
            requests_log.propagate = True

        # Chain up to jenkins.Jenkins with URL and auth details
        super(JenkinsAPI, self).__init__(
            self.jenkins_url, self.user, self.password
        )


def main():
    aparser = ArgumentParser(
        description="Trigger Jenkins jobs through its API"
    )
    aparser.add_argument("job", metavar="JOB", help="jenkins job")
    aparser.add_argument(
        "params",
        metavar="PARAM",
        nargs="*",
        help="job parameter in param=value format",
    )
    aparser.add_argument(
        "--build-url",
        action="store_true",
        help="wait for and print Jenkins URL",
    )
    aparser.add_argument(
        "--debug", action="store_true", help="enable HTTP debugging"
    )
    args = aparser.parse_args()

    print(args.params)
    # Create API connection
    jenkins = JenkinsAPI(debug=args.debug)

    # Build the parameters into a list of 2 member tuples
    if len(args.params) > 0:
        job_params = [tuple(param.split("=", 1)) for param in args.params]
    else:
        job_params = None

    # Queue the job
    try:
        queue_number = jenkins.build_job(args.job, parameters=job_params)
    except requests.HTTPError as err:
        # If the job has parameters, Jenkins requires that you call it
        # with buildWithParameters even if you don't want to override
        # any of the defaults. Call again with an empty set of
        # parameters so that build_job() is convinced to use the
        # buildWithParameters Jenkins API.
        if len(args.params) == 0 and err.response.status_code == 400:
            job_params = [("", "")]
            queue_number = jenkins.build_job(args.job, parameters=job_params)
        else:
            raise

    # If the caller doesn't want the build URL, we're done
    if not args.build_url:
        return

    # Poll the queue for a bit
    waited = 0
    while True:
        data = jenkins.get_queue_item(queue_number)

        if "executable" in data:
            print(data["executable"]["url"])
            break
        elif data.get("cancelled", False):
            print("Build was cancelled", file=sys.stderr)
            break

        if waited >= QUEUE_POLL_TIMEOUT:
            print(
                "Job",
                args.job,
                "did not begin building within",
                QUEUE_POLL_TIMEOUT,
                file=sys.stderr,
            )
            break

        time.sleep(1)
        waited += 1


if __name__ == "__main__":
    main()
