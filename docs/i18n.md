Internationalisation of kolibri-explore-plugin
===

Overview
---

Internationalisation (i18n) of kolibri-explore-plugin works the same way as i18n
of Kolibri, to the extent that the build rules are named the same. It’s done
using tooling from kolibri-tools, and an overview of the system is given
[in the Kolibri documentation](https://kolibri-dev.readthedocs.io/en/develop/i18n.html).

An overview of i18n in Django is [here](https://docs.djangoproject.com/en/1.11/topics/i18n/),
which covers the backend of kolibri-explore-plugin.

At a high level, translatable strings are extracted from Python, JavaScript and
Vue files, and are collated into several files:
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/django.po`
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/ek-components-messages.csv`
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/kolibri_explore_plugin-messages.csv`
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/template-ui-messages.csv`

This extraction process is done by running `yarn i18n-extract`.

They are in several files because they are extracted from the Django backend and
the different node frontend modules separately.

Translations are done (currently manually) on the strings in the CSV files, to
produce JSON files for each locale. A translation workflow which has worked in
the past is to import the CSV files into Google Docs, translate them
collaboratively, download the results as CSV files (being careful with the
column headers; see commit e7819e3d3d1747632253fe683bb876970955d40b), then run
`yarn i18n-download-translations` to convert the translated CSV files to JSON.

For this to work, each CSV file must contain `Identifier` and `Translation`
columns, named exactly that. It may contain other columns (they are ignored),
and the filename may be anything ending in `.csv`.

**Note:** Currently the translated strings from the
`ek-components-messages.json` and `template-ui-messages.json` files must also be
copied into `kolibri_explore_plugin.app-messages.json` in all locales. (For
example, see commit 8ae264cb83d3b7d5fa19effb82e9772a49f9c751.) This is because
Kolibri only automatically loads `kolibri_explore_plugin.app-messages.json` in
webpack.

The results are committed to git as:
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/django.po`
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/ek-components-messages.json`
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/kolibri_explore_plugin.app-messages.json`
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/template-ui-messages.json`

The translated files for Django now need to be compiled to a machine readable
form. This is also done by `yarn i18n-download-translations`. (The naming is
because, in Kolibri, this step downloads updated translations from a translation
website before compiling them — we do not currently do that in
kolibri-explore-plugin.)

It compiles the Django messages to the following file:
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/django.mo`

This is loaded by Django to provide backend translations.

It also generates the following two files, which contain information about the
locale (such as its name and currency and date formats). They are for use with
the node [`intl`](https://www.npmjs.com/package/intl) and
[`vue-intl`](https://www.npmjs.com/package/vue-intl) packages:
 * `kolibri_explore_plugin/assets/src/intl-locale-data.js`
 * `kolibri_explore_plugin/assets/src/vue-intl-locale-data.js`

The frontend loads the installed source JSON file
(`kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/kolibri_explore_plugin.app-messages.json`)
at runtime. It does this by looking for it using a well-known name in
`LOCALE_PATHS`, then the `WebpackBundleHook.frontend_messages()` function
injects the contents of the JSON file into the frontend JavaScript with a call
to `kolibriCoreAppGlobal.registerLanguageAssets()` to register it with the
translation functions. The frontend will not load other JSON files, such as
`template-ui-messages.json`.

Configuration
---

Internationalisation configuration is in two places:
 * `kolibri_explore_plugin/locale/language_info.json`
 * `pyproject.toml`/`setup.cfg`

The JSON file contains the list of languages which we want kolibri-explore-plugin
translated to. It’s in a format needed by kolibri-tools documented
[here](https://kolibri-dev.readthedocs.io/en/develop/i18n.html#adding-a-newly-supported-language).

`pyproject.toml` is needed to point kolibri-tools at the right directories for
extracting and compiling translatable strings. Older versions of kolibri-tools
looked at `setup.cfg` for the same information; we are porting to
`pyproject.toml` though.
