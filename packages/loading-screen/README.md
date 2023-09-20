loading-screen
===

This is a simple vue application which displays a loading screen to the user,
before they enter the full Kolibri application.

It’s used in the Android version of Endless Key, and is run by
[kolibri-installer-android](https://github.com/endlessm/kolibri-installer-android/).

Building
---

Typically, loading-screen is built as part of
[building kolibri-explore-plugin](https://github.com/endlessm/kolibri-explore-plugin/blob/master/README.md#building) and doesn’t need to be built separately.

However, if it does need building separately, this can be done with the
following command inside the pyenv which is set up for
[building kolibri-explore-plugin](https://github.com/endlessm/kolibri-explore-plugin/blob/master/README.md#setup):
```
yarn run lerna run build --scope=loading-screen
```

Translation
---

As it’s standalone, run outside the context of a Kolibri plugin, loading-screen
has no access to kolibri-tools or the Kolibri internationalisation
infrastructure. So instead it uses
[formatjs](https://formatjs.io/docs/getting-started/application-workflow)
directly.

Strings are marked for translation by calling
[`$formatMessage`](https://formatjs.io/docs/intl/#formatmessage) on them.
They’re extracted from the source code by running `yarn run extract-messages`,
which produces `lang/en-US.json`. This file can then be translated and committed
as `lang/*.json` for other languages.

All the language files are compiled (`yarn run compile-messages`) before being
bundled by webpack for dynamic inclusion into `main.js`. The locale to use is
detected at runtime from the user’s web browser — this differs from what Kolibri
does, as it encodes locale choice into the URI.

Testing
---

To test the loading-screen locally without building kolibri-installer-android, run
the following inside the same pyenv as for building:
```
yarn run lerna run serve -- --scope=loading-screen -- --port=5000
```

This will serve the loading-screen app at http://localhost:5000/.

The locale for the loading screen will be
[loaded from your web browser](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages).
You can override this by changing language in your browser, or by changing the
value of `requestedLocales` in `main.js`:
```
const requestedLocales = ['sk-SK', 'es-ES', 'en-GB', 'en-US'];
```
