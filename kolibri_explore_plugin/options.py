# Copyright 2021-2023 Endless OS Foundation LLC
# SPDX-License-Identifier: GPL-2.0-or-later

option_spec = {
    "Explore": {
        "APPS_BUNDLE_PATH": {
            "type": "string",
            "default": "",
            "description": """
                Location where channel app bundles are stored. Defaults
                to the package install directory.
            """,
        },
        "CONTENT_COLLECTIONS_PATH": {
            "type": "string",
            "default": "",
            "description": """
                Location where collections manifests are stored. Defaults
                to the static/collections folder.
            """,
        },
        "SHOW_AS_STANDALONE_CHANNEL": {
            "type": "boolean",
            "default": False,
            "description": """
                Whether to inform the channel presentation that it is
                standalone.
            """,
        },
        "USE_EK_IGUANA_PAGE": {
            "type": "boolean",
            "default": False,
            "description": """
              Wheter to use the hardcoded sections from EK Iguana release
              in the landing page. Otherwise it is expected that content is
              tagged accordingly to fill the sections of the landing page.
            """,
        },
        "ENABLE_SIDE_NAV": {
            "type": "boolean",
            "default": False,
            "description": """
                Whether to show the Kolibri navigation bar in the Explore
                page.
            """,
        },
        "HIDE_DISCOVERY_TAB": {
            "type": "boolean",
            "default": False,
            "description": """
                Whether to hide the Discovery tab and redirect to Search.
            """,
        },
        "FEEDBACK_URL": {
            "type": "string",
            "default": "https://endlessos.org/key-feedback",
            "description": """
                Form to link to from the Feedback button, or the empty string
                to hide it
            """,
        },
        "FEEDBACK_URL_ES": {
            "type": "string",
            "default": "https://endlessos.org/key-feedback-es",
            "description": """
                Form to link to from the Feedback button for Spanish.
            """,
        },
    },
}
