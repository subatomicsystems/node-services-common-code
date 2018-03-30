"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
let env = process.argv.indexOf('-env') === -1 ? (process.env['ENV'] || 'development') : process.argv[process.argv.indexOf('-env') + 1];
let configJson = {};
try {
    configJson = require('../../../config.json');
}
catch (err) {
    console.warn('No config.json file was found for this repository');
}
let env_Config = configJson[env] || {};
let envConfig = _.merge(configJson, env_Config);
exports.envConfig = envConfig;
if (!envConfig.base) {
    envConfig.base = '';
}
envConfig.env = env;
exports.default = envConfig;
//# sourceMappingURL=env-config.js.map