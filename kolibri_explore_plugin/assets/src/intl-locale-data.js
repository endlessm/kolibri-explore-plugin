/*
 * This is an auto-generated file, any manual edits will be overridden.
 *
 * To regenerate, see instructions here:
 *   https://kolibri-dev.readthedocs.io/en/develop/references/i18n.html
 *
 * This file was generated by kolibri-tools i18n-code-gen
 *
 * vue-intl and intl npm packages must both be installed for this module to function.
 */
module.exports = function(locale) {
  switch (locale) {
    case 'en':
      return new Promise(function(resolve) {
        require.ensure(['intl/locale-data/jsonp/en.js'], function(require) {
          resolve(() => require('intl/locale-data/jsonp/en.js'));
        });
      });
    case 'es-es':
      return new Promise(function(resolve) {
        require.ensure(['intl/locale-data/jsonp/es-ES.js'], function(require) {
          resolve(() => require('intl/locale-data/jsonp/es-ES.js'));
        });
      });
    default:
      return new Promise(function(resolve) {
        require.ensure(['intl/locale-data/jsonp/en.js'], function(require) {
          resolve(() => require('intl/locale-data/jsonp/en.js'));
        });
      });
  }
};
