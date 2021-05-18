const Config = require('kolibri-tools/.stylelintrc');
Config.rules['selector-pseudo-element-no-unknown'] = [
  true,
  {
    ignorePseudoElements: ['v-deep'],
  },
];

module.exports = Config;
