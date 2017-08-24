'use strict';

import * as fs from 'fs';
import * as bunyan from 'bunyan';
import config from './env-config';
const createCWStream = require('bunyan-cloudwatch');

let pkg = {name: 'node-services-common-code'};
if (fs.existsSync('../../../package.json')) {
  pkg = require('../../../package.json');
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
