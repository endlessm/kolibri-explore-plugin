# Kolibri explore plugin docker

To run this you need to create the authentication credentials:

```
docker run --rm --entrypoint htpasswd registry:2 -Bbn testuser testpassword > htpasswd
```

Then you can run the server:

```
docker-compose up
```

And you'll have:

 * stable: http://localhost/
 * master: http://localhost:8080/

You should use the user/password to access to the content.
