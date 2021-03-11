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

Now in Kolibri you should be able to navigate to a Explore tab.

## Setup

Either if you want to build or develop the plugin, please follow these
instructions.

1. Install dependencies:

```
pip install -r requirements.txt --upgrade
```

2. Install node and yarn. Assuming you have nodeenv:

```
nodeenv -p --node=10.17.0
npm install -g yarn@1.22.10
```

3. Install the Javascript dependencies:

```
yarn install
```

## Building
### Bundling custom channel presentations

All custom presentation app bundles should be added in the
`kolibri_explore_plugin/apps` directory to have this fully
working. The zip bundle should be named custom-channel-ui.zip and it
should be placed inside the corresponding app folder.

You can find the custom channel presentation vue applications in this
repository: https://github.com/endlessm/kolibri-channel-custom-web-app

### Creating the `.whl` file

With all dependencies installed and all the zips in place, it's now
possible to build using `make`:

```
make dist
```

**Note: Before calling `make dist` you need to bundle all custom
channel presentations!**

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

### Using real content while developing a custom channel presentation

Instead of bundling the custom channel presentation inside the apps
directory, it's possible to work with a proxy for development. Note
that the proxy will be used for all the channels, not only for the app
in question.

1. Run the custom channel presentation development server without mock
   data:

```
$ cd kolibri-channel-custom-web-app/template-ui
$ VUE_APP_USE_MOCK_DATA=false yarn serve
```

2. Run Kolibri with the `PROXY_CUSTOM_CHANNEL` environ enabled:

```
PROXY_CUSTOM_CHANNEL=1 yarn run devserver-hot
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

### Making a release

If you are releasing a new version, first please bump to either major,
minor or patch. Eg:

```
make bumpversion part=patch
```

That creates a new commit and a git tag. Please push them to the
remote:

```
git push
git push origin NEW_TAG
```

Then build:

```
make dist
```

And finally upload the built `.whl` file to PyPi:

```
make release
```
