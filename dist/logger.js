'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const env_config_1 = require("./env-config");
const findConfig = require('find-config');
const createCWStream = require('bunyan-cloudwatch');
let pkgPath = findConfig.read('package.json');
let pkg;
if (pkgPath) {
    pkg = require(pkgPath);
}
else {
    pkg = { name: 'could-not-find-package-json' };
}
let streams = [];
if (process.env['LOG'] !== 'false') {
    streams = [{
            stream: process.stdout
        }];
}
if (env_config_1.default.env !== 'development') {
    const cloudWatchStream = createCWStream({
        logGroupName: `/node-apis/${env_config_1.default.env}`,
        logStreamName: pkg.name,
        cloudWatchLogsOptions: {
            region: 'us-west-1'
        }
    });
    streams.push({
        stream: cloudWatchStream,
        type: 'raw',
        level: 'info'
    });
}
const logger = bunyan.createLogger({
    name: pkg.name,
    streams
});
exports.logger = logger;
process.on('uncaughtException', (err) => {
    logger.fatal('uncaught exception', err);
});
process.on('SIGTERM', () => {
    logger.fatal('SIGTERM');
});
exports.default = logger;
//# sourceMappingURL=logger.js.map