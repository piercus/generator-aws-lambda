'use strict';
const yeoman = require('yeoman-generator');
const moment = require('moment');
const uppercamelcase = require('uppercamelcase');
const _s = require('underscore.string');

const features = {
};

const featuresList = Object.keys(features);

module.exports = class extends yeoman.Base {

	init() {
		// Ask the questions
		return this.prompt([
			{
				name: 'arn',
				message: 'What\'s the arn of your lambda function ?',
				validate: val => val.length > 0 ? true : 'You have to provide an arn'
			},
			{
				name: 'functionName',
				message: 'What\'s the name of your service?',
				default: this.appname.replace(/\s/g, '-'),
				filter: x => _s.slugify(x)
			},
			{
				name: 'functionDescription',
				message: 'What\'s the description of the service?',
				validate: val => val.length > 0 ? true : 'You have to provide a description'
			},
			{
				name: 'keywords',
				message: 'Provide a list of keywords (comma- or space-separated)?',
				filter: keywords => keywords.replace(/,? /g, ',').split(',')
			},
			{
				name: 'githubUsername',
				message: 'What\'s your GitHub username?',
				store: true,
				filter: username => username.trim()
			},
			{
				name: 'name',
				message: 'What\'s your name?',
				store: true,
				when: props => props.githubUsername.length === 0,
				validate: val => val.length > 0 ? true : 'You have to provide your name'
			},
			{
				name: 'email',
				message: 'What\'s your email address?',
				store: true,
				when: props => props.githubUsername.length === 0,
				validate: val => val.length > 0 ? true : 'You have to provide your email address'
			},
			{
				name: 'region',
				message: 'Which AWS region you want to work with?',
				default: 'us-east-1'
			}
		]).then(props => {
			// Build the list of dependencies
			const dependencies = {};

			// Build up the template
			const tpl = {
				functionName: props.functionName,
				functionDescription: props.functionDescription,
				keywords: props.keywords,
				arn: props.arn,
				name: props.name || this.user.git.name(),
				email: props.email || this.user.git.email(),
				generateDocs: props.docs,
				region: props.region,
				dependencies,
				date: moment().format('DD MMM. YYYY')
			};

			for (const feature of featuresList) {
				const hasFeature = props.features.indexOf(feature) !== -1;

				if (hasFeature) {
					tpl.dependencies[feature] = features[feature];
				}

				tpl['include' + uppercamelcase(feature)] = hasFeature;
			}

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			// Copy the template files
			this.fs.copyTpl(this.templatePath() + '/**', this.destinationPath(), tpl);

			// Rename the files
			mv('_package.json', 'package.json');
			mv('travis.yml', '.travis.yml');
			mv('gitignore', '.gitignore');
			mv('gitattributes', '.gitattributes');
			mv('editorconfig', '.editorconfig');
		});
	}

	install() {
		// Install node dependencies
		this.installDependencies({bower: false});
	}
};
