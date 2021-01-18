Getting started with development
--------------------------------

To get this plugin working with the same workflow described on
[the kolibri dev doc](https://kolibri-dev.readthedocs.io/en/develop/getting_started.html#development-server),
you can do the following:

1. Clone this repo in your favourite projects folder
2. Create a link in the kolibri project root:

```
ln -s DOWNLOAD_FOLDER/kolibri_explore_plugin/kolibri_explore_plugin .
```

3. Enable this new plugin:

```
    kolibri plugin enable kolibri_explore_plugin
```

4. Edit the `build_tools/build_plugins.txt` file to add this new plugin:

```
kolibri.core
kolibri.plugins.*
kolibri_explore_plugin
```

Now you can run the development server and if you edit the source plugin files,
javascript or python, the kolibri web will be updated automatically.

```
yarn run devserver-hot
```

## A

An alternative for development is to install the repository as an
editable package, which creates a symlink:

```
pip install -e .
```

And then run the Javascript in watch mode in a separate terminal:

```
yarn dev
```

This approach has advantages to the one above:
- The development code is the same as the build.
- No need to edit the plugins text file.

Deployment
----------

1. Clone this repo.
2. Install dependencies with pipenv

```
    pipenv --python 3
    pipenv shell
    pip install -r requirements.txt --upgrade
```

3. Install node.js and yarn

```
    nodeenv -p --node=10.15.3
    npm install -g yarn
```

3. Install plugin javascript dependencies and build

```
    yarn install
```

4. Now that all dependencies are installed, it's possible to build using make

```
    make dist
```

After the `make dist` an installable `.whl` file will be created on `dist/`
folder.

5. Upload to PyPi:

You can publish the generated `dist/kolibri_explore_plugin*.whl` to pypi
just running:

```
    make release
```

Use
---

Once the package is installed (from pypi or just installing the whl file), you
can enable like a normal kolibri plugin:

```
    kolibri plugin enable kolibri_explore_plugin
```

If you have the plugin installed in the same pip env that you use for building
again, the `make dist` will fail.

To be able to rebuild again you should remove the python module, so before
calling the `make dist` again, you should remove the `kolibri_explore_plugin`:

```
    pip uninstall kolibri_explore_plugin
```

Configure precommit hook
------------------------

To run lint before any commit just run this command:

```
    pre-commit install -f --install-hooks
```
