

define([

	'backbone',
	'view/home',
],
function (

	Backbone,
	homeView
) {

	'use strict';


	return Backbone.Router.extend({

		routes: {

			'': 'routeDefault',
		},

		initialize: function () {

			this.radio = Backbone.Wreqr.radio.channel('global');

			Backbone.history.start();
		},

		routeDefault: function () {

			this.radio.reqres.request('region', 'screen').show( new homeView() );
		},
	});
});
