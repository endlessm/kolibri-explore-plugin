from kolibri.deployment.default.settings.base import *  # noqa @UnusedWildImport


MIDDLEWARE = list(MIDDLEWARE) + [  # noqa F405
    "kolibri_explore_plugin.middleware.AlwaysAuthenticatedMiddleware"
]
