'use strict';

import * as bunyan from 'bunyan';
import config from './env-config';
const BunyanAWS = require('bunyan-aws');
const pkg = require('../package.json');

// array of streams
let streams: any[] = [];

if (process.env.LOG !== 'false') {
  streams = [{
    level: 'info',
    type: 'rotating-file',
    path: 'info.log',
    period: '1d',
    count: 3
  }, {
    level: 'error',
    type: 'rotating-file',
    path: 'error.log',
    period: '1d',
    count: 3
  }, {
    stream: process.stdout
  }];
}

// we don't want to log to CloudWatch for local development
if (config.env !== 'development') {
  // create a stream that pipes it into cloudwatch
  const CwStream = new BunyanAWS({
    logGroupName: `/node-apis/${config.env}`,
    logStreamName: pkg.name,
    cloudWatchOptions: {
      region: 'us-west-1',
      sslEnabled: true
    }
  });
  streams.push({
    stream: CwStream,
    type: 'raw',
    level: 'info',
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

process.on('SIGTERM', (err: any) => {
  logger.fatal('SIGTERM', err);
});

export { logger };
export default logger;
