FROM python:3.9-buster

EXPOSE 8080
WORKDIR /docker/

ENV KOLIBRI_HOME=/kolibri-home

ENV KOLIBRI_CACHE_BACKEND=memory
ENV KOLIBRI_DATABASE_ENGINE=postgres
ENV KOLIBRI_DATABASE_NAME=kolibri
ENV KOLIBRI_DATABASE_PASSWORD=kolibri
ENV KOLIBRI_DATABASE_USER=kolibri
ENV KOLIBRI_DATABASE_HOST=postgres
ENV KOLIBRI_DATABASE_PORT=5432
ENV KOLIBRI_CHERRYPY_START=false

RUN pip install uwsgi
RUN pip install psycopg2-binary
RUN pip install kolibri

COPY uwsgi.ini /docker/uwsgi.ini
COPY entrypoint.sh /docker/entrypoint.sh

RUN pip install kolibri-explore-plugin

ENTRYPOINT [ "/docker/entrypoint.sh" ]
