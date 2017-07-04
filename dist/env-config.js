"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const logger_1 = require("./logger");
let env = process.argv.indexOf('-env') === -1 ? (process.env.ENV || 'development') : process.argv[process.argv.indexOf('-env') + 1];
let configJson = {};
try {
    configJson = require('../../../config.json');
}
catch (err) {
    console.warn('No config.json file was found for this repository');
}
let env_Config = configJson[env] || {};
let hasInstanceNumber = process.argv.indexOf('-instance') !== -1;
let envConfig = _.extend(configJson, env_Config);
exports.envConfig = envConfig;
if (!envConfig.base) {
    envConfig.base = '';
}
envConfig.env = env;
if (hasInstanceNumber) {
    let instanceNumber = parseInt(process.argv[process.argv.indexOf('-instance') + 1]);
    envConfig.port += instanceNumber;
    if (instanceNumber > 9) {
        logger_1.logger.warn('Number of instances is expected not to exceed 9 because of possible port conflicts with other services.');
    }
}
exports.default = envConfig;
//# sourceMappingURL=env-config.js.map