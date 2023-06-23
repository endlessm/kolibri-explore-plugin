try:
    from ._version import __version__  # noqa: F401
except ModuleNotFoundError:
    __version__ = "0.dev0"

default_app_config = "kolibri_explore_plugin.apps_config.ExploreConfig"
