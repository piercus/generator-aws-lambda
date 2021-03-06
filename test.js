import path from 'path';
import fs from 'fs';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import tempfile from 'tempfile';

const fsP = pify(fs);

test.beforeEach(async t => {
	t.context.dir = tempfile();
	await pify(helpers.testDirectory)(t.context.dir);
	t.context.generator = helpers.createGenerator('aws-lambda-worker', [path.join(__dirname, '/app')], null, {skipInstall: true});
});

test.serial('generates expected files', async t => {
	const generator = t.context.generator;

	helpers.mockPrompt(generator, {
		functionName: 'test',
		functionDescription: 'test description',
		keywords: ['foo', 'bar', 'baz'],
		githubUsername: 'test',
		invoke: true,
		docs: false,
		features: []
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'.editorconfig',
		'.gitattributes',
		'.gitignore',
		'.travis.yml',
		'index.js',
		'gruntfile.js',
		'package.json',
		'readme.md',
		'config.json',
		'test/test.js',
		'test/fixtures/bootstrap.js',
		'test/fixtures/env.js'
	]);
});

test.serial('generates expected package.json', async t => {
	const generator = t.context.generator;

	helpers.mockPrompt(generator, {
		functionName: 'foo',
		functionDescription: 'bar',
		keywords: ['foo', 'bar', 'baz'],
		githubUsername: 'test',
		docs: false,
		features: []
	});

	await pify(generator.run.bind(generator))();

	const pkg = JSON.parse(await fsP.readFile(path.join(t.context.dir, 'package.json'), 'utf8'));

	assert.equal(pkg.name, 'foo');
	assert.equal(pkg.description, 'bar');
	assert.deepEqual(pkg.keywords, ['foo', 'bar', 'baz']);
	assert.deepEqual(pkg.dependencies, {
		'aws-lambda-env': '^3.0.0'
	});
});
