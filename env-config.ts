// This will read the config.json file,
// get the settings for the current environment and combine them with the global settings
// Any global settings that are also in the environment specific settings will be overridden

import * as _ from 'lodash';
let env = process.argv.indexOf('-env') === -1 ? (process.env['ENV'] || 'development') : process.argv[process.argv.indexOf('-env') + 1];
let configJson: any = {};
try {
  configJson = require('../../../config.json');
} catch (err) {
  console.warn('No config.json file was found for this repository');
}

let env_Config = configJson[env] || {};
let envConfig: any = _.merge(configJson, env_Config);
if (!envConfig.base) {
  envConfig.base = '';
}
envConfig.env = env;
export {envConfig};
export default envConfig;