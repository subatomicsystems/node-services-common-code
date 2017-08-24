'use strict';

import * as bunyan from 'bunyan';
import config from './env-config';
const createCWStream = require('bunyan-cloudwatch');

const parent = require('parent-package-json');

let pkg: {name: string};
let parentPackageJsonPath: any;
try {
  parentPackageJsonPath = parent('/');
} catch (ex) {
  console.error(ex);
}
if (parentPackageJsonPath) {
  pkg = parent('/').parse();
} else {
  pkg = {name: 'could-not-find-package-json'};
}

// array of streams
let streams: any[] = [];

if (process.env['LOG'] !== 'false') {
  streams = [{
    stream: process.stdout
  }];
}

// we don't want to log to CloudWatch for local development
if (config.env !== 'development') {
  // create a stream that pipes it into cloudwatch
  const cloudWatchStream = createCWStream({
    logGroupName: `/node-apis/${config.env}`,
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

// Gracefully handle the server being killed by external processes like NodeMon so that the port is also closed.
process.on('uncaughtException', (err: any) => {
  logger.fatal('uncaught exception', err);
});

process.on('SIGTERM', () => {
  logger.fatal('SIGTERM');
});

export { logger };
export default logger;
