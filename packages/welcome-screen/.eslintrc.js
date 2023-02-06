const Config = require('kolibri-tools/.eslintrc');

// FIXME: Reenable import errors. kolibri-tools is doing something
// weird with the '@' import alias.
Config['extends'] = Config['extends'].filter((s) => s !== 'plugin:import/errors')
module.exports = Config;
