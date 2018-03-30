'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const path = require("path");
const fs = require("fs");
const env_config_1 = require("./env-config");
const createCWStream = require('bunyan-cloudwatch');
const parent = require('parent-package-json');
const isLambda = require('is-lambda');
let logger;
exports.logger = logger;
if (isLambda) {
    exports.logger = logger = console;
}
else {
    let pkg = null;
    let localPackagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(localPackagePath)) {
        pkg = require(localPackagePath);
    }
    else {
        let parentPackageJsonPath = parent(process.cwd());
        if (parentPackageJsonPath) {
            pkg = parent().parse();
        }
    }
    if (!pkg || pkg.name === 'node-services-common-code') {
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
    exports.logger = logger = bunyan.createLogger({
        name: pkg.name,
        streams
    });
    process.on('uncaughtException', (err) => {
        logger.fatal('uncaught exception', err);
    });
    process.on('SIGTERM', () => {
        logger.fatal('SIGTERM');
    });
}
exports.default = logger;
//# sourceMappingURL=logger.js.map