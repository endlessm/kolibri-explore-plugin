FROM python:3-buster

EXPOSE 8080
WORKDIR /docker/

ENV KOLIBRI_HOME=/kolibri-home

RUN pip install kolibri
RUN pip install kolibri-explore-plugin

# plugin enable
RUN kolibri plugin enable kolibri.plugins.app
RUN kolibri plugin disable kolibri.plugins.learn
RUN kolibri plugin enable kolibri_explore_plugin

ENTRYPOINT [ "kolibri", "start", "--foreground" ]
