#!/usr/bin/env node

'use strict';

const xargs = require('../lib/xargs');

const args = xargs
  .usage('xperf start [script.js] [options]')
  .command('start', script => (/^.*\.js$/.test(script)), 'script must be js!')
  .option('start-cpu-profiling').boolean()
  .option('start-gc-profiling').boolean()
  .option('start-heap-profling').boolean()
  .argv;

console.log(12333, args);