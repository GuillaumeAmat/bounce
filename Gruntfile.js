
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');



	grunt.initConfig({

		clean: {

			build: [

				'www/bower_components',
				'www/templates',
			]
		},

		copy: {

			requirejs: {

				src: 'app/bower_components/requirejs/require.js',
				dest: 'app/js/require.js'
			},
		},

		less: {

			default: {

				files: {

					'app/css/app.css': 'app/css/app.less'
				}
			}
		},

		jst: {

			compile: {

				options: {

					processName: function(filename) {

						return filename.slice('app/templates/'.length, filename.length);
					}
				},
				files: {

					'app/templates/templates.js': ['app/templates/**/*.html']
				}
			}
		},

		requirejs: {

			compile: {

				options: {

					appDir: 'app',
					baseUrl: 'js',
					dir: 'www',
					modules: [{ 'name': 'app' }],
					mainConfigFile: 'app/js/config.js',
					findNestedDependencies: true,
					removeCombined: true,
					logLevel: 1,
				}
			}
		},

		watch: {

			copy_require_js: {

				files: [

					'app/bower_components/requirejs/require.js'
				],
				tasks: ['copy:requirejs']
			},
			css: {

				files: [

					'app/css/**/*.less'
				],
				tasks: ['less:default']
			},
			templates: {

				files: [

					'app/templates/**/*.html'
				],
				tasks: ['jst']
			}
		},
	});



	grunt.registerTask('default', [

		'less:default',
		'jst',
		'copy:requirejs',
	]);

	grunt.registerTask('build', [

		'default',
		'requirejs',
		'clean:build',
	]);
};
