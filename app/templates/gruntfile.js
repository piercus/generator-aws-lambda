
module.exports = function (grunt) {
	grunt.initConfig({
		lambda_deploy: { // eslint-disable-line camelcase
			dev: {
				options: {
					region: '<%= region %>'
				},
				arn: '<%= arn %>',
			}
		},
		lambda_package: { // eslint-disable-line camelcase
			dev: {
				options: {}
			}
		}

	});
	grunt.loadNpmTasks('grunt-aws-lambda');
	grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
};
