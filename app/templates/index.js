'use strict';
const lambdaEnv = require('aws-lambda-env');
const config = require('./config.json');

exports.handler = (event, context, callback) => {
	const env = lambdaEnv(context);
	callback(null, 'world');
};
