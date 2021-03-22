#!/bin/bash

kolibri manage migrate
kolibri services --background

uwsgi --ini uwsgi.ini
