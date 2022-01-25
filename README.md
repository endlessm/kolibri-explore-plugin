# Kolibri Explore Plugin

This is an alternative to the Kolibri Learn plugin, intended for
self-guided learners.

## Usage

Install a release from PyPi:

```
pip install kolibri-explore-plugin
```

Or build a `whl` file with the instructions below and install it:

```
pip install path/to/kolibri_explore_plugin-VERSION.whl
```

Then enable it in Kolibri, and disable the Learn plugin:

```
kolibri plugin enable kolibri_explore_plugin
kolibri plugin disable kolibri.plugins.learn
```

Download the `apps-bundle.zip` from the [GitHub releases
page](https://github.com/endlessm/kolibri-explore-plugin/releases) and
extract them to the `kolibri_explore_plugin/apps` folder.  Note that
this is not ideal, because you should know where has `pip` installed
the plugin.

Now start Kolibri.  You should be able to navigate to a Explore tab.

## Setup

Either if you want to build or develop the plugin, please run:

```
./scripts/bootstrap.sh
```

Just like kolibri, we use a Python virtual environment along with Node
to obtain the exact same dependencies.

## Building
### Creating the `.whl` file

With all the dependencies installed, it's now possible to build for
distribution running:

```
yarn build-dist
```

An installable `.whl` file will be created in the `dist/` folder.

## Development
### Getting started with development

Instead of installing a build like in the Usage section above, install
the repository as an editable package, which creates a symlink:

```
pip install -e .
```

And then run the Javascript in watch mode:

```
yarn dev
```

Usually you will also be developing Kolibri, as described in
[the Kolibri developer documentation](https://kolibri-dev.readthedocs.io/en/develop/getting_started.html).

So probably you have the following in another Terminal tab:

```
yarn run devserver-hot
```

Which should pick the plugin. And you can edit both the plugin and
Kolibri in live mode. Further, you can also edit a custom channel
presentation in another Terminal tab following the section below.

### Bundling custom channel presentations

This is done automatically on each release. To do it yourself:

```
yarn build:apps
```

All custom presentation app bundles should be added in the
`kolibri_explore_plugin/apps` directory to have this fully working.
The zip bundle should be named `custom-channel-ui.zip` and it should
be placed inside the corresponding app folder.

### Using real content while developing a custom channel presentation

Instead of bundling the custom channel presentation inside the apps
directory, it's possible to work with a proxy for development. Note
that the proxy will be used for all the channels, not only for the app
in question.

1. Run the custom channel presentation development server. For
   instance to run the template:

```
$ cd packages/template-ui
$ yarn serve
```

2. Run Kolibri with the `PROXY_CUSTOM_CHANNEL` environment variable
   enabled:

```
$ cd /PATH/TO/kolibri
$ PROXY_CUSTOM_CHANNEL=1 yarn run devserver-hot
```

Every request to the `custom-channel-ui.zip` will be proxied to the
devserver.  The hot reloading should work here too!

### Configuring the precommit hook

To run checks before any commit just run this command:

```
pre-commit install -f --install-hooks
```

There is a continuous integration tool that will run the same checks
per pull request.

### Ingesting highlighted content

Make sure to have a `.env` file with the spreadsheet key as content:

```
CONTENT_SPREADSHEET_KEY=123456
```

Then run the script:

```
./scripts/ingest_highlighted.py
```

If everything goes well, the `highlighted-content.json` file will be
updated. You then need to commit the file.

### Making a release

If you are releasing a new version, first please bump to either major,
minor or patch. Eg:

```
yarn bump-version patch
```

That creates a new commit and a git tag. Please push them to the
remote:

```
git push
git push origin NEW_TAG
```

Then build:

```
yarn build-dist
```

And finally upload the built `.whl` file to PyPi:

```
yarn release
```

### How to display the build information

To show the build information in the front page, as a tag in top right corner,
you can set the environment variable, `SHOW_BUILD_INFO` to "true", for example,
for the development kolibri server:

```
$ SHOW_BUILD_INFO=true yarn run devserver
```
