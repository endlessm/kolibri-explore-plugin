import sys

from django.apps import AppConfig


class ExploreConfig(AppConfig):
    name = "kolibri_explore_plugin"
    verbose_name = "Explore plugin"

    def ready(self):
        from django.core import management
        from django.core.management.commands import migrate

        start_command = "start" in sys.argv
        devserver = "manage" in sys.argv and "runserver" in sys.argv

        # Do not try to apply migrations on django commands, just runserver or
        # kolibri start
        if start_command or devserver:
            management.call_command(
                migrate.Command(), app_label="kolibri_explore_plugin"
            )
