

define([

	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'router',
],
function (

	$,
	_,
	Backbone,
	Marionette,
	router
) {

	'use strict';

	return Marionette.Application.extend({

		initialize: function(options) {

			this.radio = Backbone.Wreqr.radio.channel('global');


			this.addRegions({

				'screen': '.screen',
			});

			this.radio.reqres.setHandler('region', this.replyRegion, this);
		},

		onStart: function (options) {

			var self = this;

			$(window).on('localized', function () {

				self.onLocalized();
			});

			require(['webL10n']);
		},

		onLocalized: function () {

			new router();
		},

		replyRegion: function (regionName) {

			return this.getRegion( regionName );
		},
	});
});
