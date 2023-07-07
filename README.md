# Kolibri Explore Plugin

This plugin adds the Endless Key experience on top of Kolibri:

- A content navigation view exposed in the `/explore` URL. As an
  alternative to the Kolibri Learn plugin for self-guided learners.

- Branding and layout customizations for several channels.

- Download of content packs with extra metadata.

## Usage

This is a plugin for Kolibri, so it must be installed in your Kolibri
environment.

Install latest release from PyPi:

```
pip install kolibri-explore-plugin
```

Then enable it in Kolibri and run migrations:

```
kolibri plugin enable kolibri_explore_plugin
kolibri manage migrate
```

Download the `apps-bundle.zip` from the [GitHub releases
page](https://github.com/endlessm/kolibri-explore-plugin/releases) and
extract them to the `kolibri_explore_plugin/apps` folder.  Note that
this is not ideal, because you should know where has `pip` installed
the plugin.

Download the JSON files from the
[endless-key-collections](https://github.com/endlessm/endless-key-collections/tree/main/json)
repo and place them in `kolibri_explore_plugin/static/collections/`.

Now start Kolibri. You should be able to navigate to `/explore` if `/`
doesn't redirect you already.

## Setup

Make sure you already have the **latest** `pipenv`.

Either if you want to build or develop the plugin, please run:

```
./scripts/bootstrap.sh
```

Just like Kolibri, we use a Python virtual environment along with Node
to obtain the exact same dependencies.

## Building
### Creating the `.whl` file

With all the dependencies installed, it's now possible to build the
plugin by running:

```
yarn build-dist
```

A `.whl` file will be created in the `dist/` folder. You
can then install it:

```
pip install dist/kolibri_explore_plugin-*.whl
```

## Development
### Getting started with development

For developing you could build and install the `.whl` file over and
over for each iteration. But is much easier to install the project in
editable mode, which basically creates a symlink:

```
pip install --editable .
```

**Note:** you still need to enable the plugin and run migrations as in
Usage above!

Then serve the plugin in watch mode:

```
yarn dev
```

Usually you will also be developing Kolibri, as described in
[the Kolibri developer documentation](https://kolibri-dev.readthedocs.io/en/develop/getting_started.html).

So probably you have the following running in another Terminal tab:

```
yarn run devserver-hot
```

And you can edit both the plugin and Kolibri in live-mode. Further,
you can also edit a custom channel presentation in another Terminal
tab. See "Developing custom channel presentations" section below.

### Configuring the precommit hook

To run checks before any commit just run this command:

```
pre-commit install -f --install-hooks
```

There is a continuous integration tool in Github that will run the
same checks for each pull request.

### Bundling custom channel presentations

There is a Github action that does this automatically on each
release. To do it locally yourself:

```
yarn build:apps
```

All custom presentation app bundles should be added in the
`kolibri_explore_plugin/apps` directory to have this fully working.
The zip bundle should be named `custom-channel-ui.zip` and it should
be placed inside the corresponding app folder.

### Developing custom channel presentations

Instead of bundling the custom channel presentation inside the apps
directory, it's possible to work with a proxy for development. Note
that the proxy will be used for all the channels, not only for the
channel in question.

1. Run the custom channel presentation development server. For
   instance to run the template:

```bash
$ cd packages/template-ui
$ yarn serve
```

2. Run Kolibri with the `PROXY_CUSTOM_CHANNEL` environment variable
   enabled:

```bash
$ cd /PATH/TO/kolibri
$ PROXY_CUSTOM_CHANNEL=1 yarn run devserver-hot
```

Every request to the `custom-channel-ui.zip` will be proxied to the
devserver. The hot reloading should work here too!

### Ingesting highlighted content

Make sure to have a `.env` file with the spreadsheet key as content:

```bash
CONTENT_SPREADSHEET_KEY=123456
```

Then run the script:

```
./scripts/ingest_highlighted.py
```

If everything goes well, the `highlighted-content.json` file will be
updated. You then need to commit the file.

### Releasing

#### Release with GitHub action

Triggering [Bump version to release](https://github.com/endlessm/kolibri-explore-plugin/actions/workflows/bump2release.yml)
action from `bump2release.yml` will do all release steps mentioned in
[Release with local environment](#release-with-local-environment)
automatically, including:
* Bump version and create a new tag
* Publish kolibri-explore-plugin wheel package to PyPI
* Release apps-bundle.zip

#### Release with local environment

To release a new version first please bump the version number to
either major or minor. Note that the major version also needs a version
name for branding. For example:

```bash
# For a minor release:
yarn bump-version minor

# For a major release:
yarn bump-version major "Komodo Dragon"
```

That creates a new commit and a git tag. Please push them to the
remote:

```bash
git push
git push origin NEW_TAG
```

Then build:

```bash
yarn build-dist
```

And finally upload the built `.whl` file to PyPi:

```bash
yarn release
```

### How to display the build information

To show the build information in the front page, as a tag in top right corner,
you can set the environment variable, `SHOW_BUILD_INFO` to "true", for example,
for the development kolibri server:

```
$ SHOW_BUILD_INFO=true yarn run devserver
```
