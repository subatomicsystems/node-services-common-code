'use strict';

import * as bunyan from 'bunyan';
import * as path from 'path';
import * as fs from 'fs';
import config from './env-config';

const createCWStream = require('bunyan-cloudwatch');
const parent = require('parent-package-json');
const isLambda = require('is-lambda');

let logger: any;

if (isLambda) {
  // Lambda can log to cloudwatch by just calling console.log, console.error, ...
  logger = console;
} else {
  let pkg: { name: string } | null = null;
  let localPackagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(localPackagePath)) {
    pkg = require(localPackagePath);
  } else {
    let parentPackageJsonPath: any = parent(process.cwd());
    if (parentPackageJsonPath) {
      pkg = parent().parse();
    }
  }
  if (!pkg || pkg.name === 'node-services-common-code') {
    pkg = {name: 'could-not-find-package-json'};
  }

  // Array of streams
  let streams: any[] = [];

  if (process.env['LOG'] !== 'false') {
    streams = [{
      stream: process.stdout
    }];
  }

  // We don't want to log to CloudWatch for local development
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

  logger = bunyan.createLogger({
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
}

export { logger };
export default logger;
