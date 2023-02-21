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
        "INITIAL_CONTENT_PACK": {
            "type": "string",
            "default": "explorer",
            "description": """
                Id of the initial content pack. One of: explorer, artist,
                scientist, inventor, athlete, curious.
            """,
        },
    },
}
