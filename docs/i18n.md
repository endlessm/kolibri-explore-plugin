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
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/kolibri_explore_plugin-messages.csv`
 * `kolibri_explore_plugin/locale/en/LC_MESSAGES/template-ui-messages.csv`

This extraction process is done by running `yarn i18n-extract`.

They are in several files because they are extracted from the Django backend and
the different node frontend modules separately.

These files are checked into git, even though they are generated mechanically
from the source code, so that translators or external translation tools can pick
them up at any time, without having to run kolibri-tools on the code.

Translations are done (currently manually), and the results committed to git as:
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/django.po`
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/kolibri_explore_plugin.app-messages.json`
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/template-ui-messages.json`

CSV versions of the JSON files are also available for review. The CSV versions
may be imported into Google Docs, collaboratively translated, and then downloaded
again; the following step will automatically convert them back to JSON.

The translated files for Django now need to be compiled to a machine readable
form. This is done by `yarn i18n-download-translations`. (The naming is because,
in Kolibri, this step downloads updated translations from a translation website
before compiling them --- we do not currently do that in kolibri-explore-plugin.)

It compiles the Django messages to the following file:
 * `kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/django.mo`

This is loaded by Django to provide backend translations.

Secondly, it converts any local CSV files (`kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/*.csv`
to JSON files, allowing for translation to be done in Google Docs via the CSV.
For this to work, the CSV file must contain `Identifier` and `Translation`
columns, named exactly that. It may contain other columns (they are ignored),
and the filename may be anything ending in `.csv`.

It also generates the following two files, which contain information about the
locale (such as its name and currency and date formats). They are for use with
the node [`intl`](https://www.npmjs.com/package/intl) and
[`vue-intl`](https://www.npmjs.com/package/vue-intl) packages:
 * `kolibri_explore_plugin/assets/src/intl-locale-data.js`
 * `kolibri_explore_plugin/assets/src/vue-intl-locale-data.js`

The frontend loads the installed source JSON files (such as
`kolibri_explore_plugin/locale/${locale}/LC_MESSAGES/kolibri_explore_plugin.app-messages.json`)
at runtime. It does this by looking for them using a well-known name in
`LOCALE_PATHS`, then the `WebpackBundleHook.frontend_messages()` function
injects the contents of the JSON files into the frontend JavaScript with a call
to `kolibriCoreAppGlobal.registerLanguageAssets()` to register them with the
translation functions.

Configuration
---

Internationalisation configuration is in two places:
 * `kolibri_explore_plugin/locale/language_info.json`
 * `setup.cfg`

The JSON file contains the list of languages which we want kolibri-explore-plugin
translated to. It’s in a format needed by kolibri-tools documented
[here](https://kolibri-dev.readthedocs.io/en/develop/i18n.html#adding-a-newly-supported-language).

`setup.cfg` is needed to point kolibri-tools at the right directories for
extracting and compiling translatable strings.
