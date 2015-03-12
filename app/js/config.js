

requirejs.config({

	paths: {

		'templates': '../templates/templates',
        'underscore': '../bower_components/underscore/underscore',
		'backbone': '../bower_components/backbone/backbone',
		'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'webL10n': '../bower_components/webL10n/l10n',
		'easeljs': '../bower_components/easeljs/lib/easeljs-0.8.0.combined',
	},

	deps: ['app'],

	callback: function (app) {

		new app().start();
	}
});
