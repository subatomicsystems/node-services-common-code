// This will read the config.json file,
// get the settings for the current environment and combine them with the global settings
// Any global settings that are also in the environment specific settings will be overridden

import * as _ from 'lodash';
import { logger } from './logger';
let env = process.argv.indexOf('-env') === -1 ? (process.env.ENV || 'development') : process.argv[process.argv.indexOf('-env') + 1];
let configJson: any = {};
try {
  configJson = require('../../../config.json');
} catch (err) {
  console.warn('No config.json file was found for this repository');
}

let env_Config = configJson[env] || {};
let hasInstanceNumber: any  = process.argv.indexOf('-instance') !== -1;
let envConfig: any = _.extend(configJson, env_Config);
if (!envConfig.base) {
  envConfig.base = '';
}
envConfig.env = env;
if (hasInstanceNumber) {
  let instanceNumber: number = parseInt(process.argv[process.argv.indexOf('-instance') + 1]);
  envConfig.port += instanceNumber;

  if (instanceNumber > 9) {
    logger.warn('Number of instances is expected not to exceed 9 because of possible port conflicts with other services.');
  }
}
export {envConfig};
export default envConfig;