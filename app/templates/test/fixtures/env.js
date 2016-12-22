'use strict';
const pkg = require('../../package.json');
const cfg = require('../../config.json');

process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.AWS_LAMBDA_FUNCTION_NAME = `test_${pkg.name}`;
process.env.AWS_REGION = cfg.region;
