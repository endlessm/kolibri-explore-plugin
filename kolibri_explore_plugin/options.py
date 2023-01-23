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
        "NEW_COLLECTIONS_PAGE_FEATURE": {
            "type": "boolean",
            "default": False,
            "description": """
              Dev feature flag to test the new collections page.
            """,
        },
    },
}
