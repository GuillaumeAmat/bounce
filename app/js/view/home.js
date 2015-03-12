

define([

	'jquery',
	'backbone',
	'marionette',
	'templates',
],
function (

	$,
	Backbone,
	Marionette
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['home.html'],
	});
});
