# Python Backend Tests

This directory contains tests for the plugin's Python backend. The test
suite uses the [pytest][pytest] framework. Since Kolibri is ultimately a
Django application, it also requires [pytest-django][pytest-django] to
handle Django configuration and access. Additionally, a small [pytest
plugin](plugin.py) is used to coordinate the initialization of Kolibri
and Django.

[pytest]: https://docs.pytest.org/en/stable/
[pytest-django]: https://pytest-django.readthedocs.io/en/latest/

## Developing tests

See the pytest [getting started][pytest-getting-started] for the basics
of writing and running tests. In addition to pytest basics,
[fixtures][pytest-fixtures] and [marks][pytest-marks] are important
pytest features for configuring the testing context. Pytest provides
several [built-in fixtures][pytest-built-in-fixtures] as well as the
ability to define custom fixtures.

[pytest-getting-started]: https://docs.pytest.org/en/stable/getting-started.html
[pytest-fixtures]: https://docs.pytest.org/en/stable/explanation/fixtures.html
[pytest-marks]: https://docs.pytest.org/en/stable/how-to/mark.html
[pytest-built-in-fixtures]: https://docs.pytest.org/en/stable/reference/fixtures.html#built-in-fixtures

As mentioned above, Kolibri is a Django application. Parts of the plugin
that interact with Django such as database models require additional
configuration to work properly. Django provides several
[components][django-testing-tools] to handle this configuration.
However, since Django's components are based on [unittest][unittest],
pytest-django provides equivalents for pytest style testing.

[django-testing-tools]: https://docs.djangoproject.com/en/1.11/topics/testing/tools/
[unittest]: https://docs.python.org/3/library/unittest.html

For example, any tests using a Django model will require access to the
Django database. When using pytest-django, the easiest way to provide
this access is to add the `@pytest.mark.django_db` decorator to the test
function. This starts a database transaction for each test and then
discards the transaction at the end of the test so that the database is
reset. This is much faster than flushing the database after each test.
See the pytest-django [database access][pytest-django-db-access]
documentation for more details.

[pytest-django-db-access]: https://pytest-django.readthedocs.io/en/latest/database.html

pytest-django also provides [helpers][pytest-django-helpers] to replace
the Django testing tools. For example, the
[`client`][pytest-django-client] fixture will provide a Django [test
client][django-test-client] for the test to make HTTP requests without
actually starting the Django server.

[pytest-django-helpers]: https://pytest-django.readthedocs.io/en/latest/helpers.html
[pytest-django-client]: https://pytest-django.readthedocs.io/en/latest/helpers.html#client-django-test-client
[django-test-client]: https://docs.djangoproject.com/en/1.11/topics/testing/tools/#the-test-client

When testing database models, it's useful to preload the database
tables. Django refers to this as [fixture
loading][django-fixture-loading]. While Django's unittest derived test
classes have built-in support for loading database fixtures, this needs
to be performed manually with the `loaddata` command with pytest tests.
The command can be called with Django's `call_command` function. For
example:

```
import pytest
from django.core.management import call_command

from ..models import MyModel

@pytest.mark.django_db
def test_my_model():
    call_command("loaddata", "test-data.json")
    assert MyModel.objects.count() == 3
```

[django-fixture-loading]: https://docs.djangoproject.com/en/1.11/topics/testing/tools/#fixture-loading

By default, `loaddata` searches for fixtures in each app's `fixtures`
directory. Database fixtures can be prepared with the `dumpdata`
management command, which can be executed with `kolibri manage
dumpdata`.
