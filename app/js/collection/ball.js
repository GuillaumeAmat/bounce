

define([

	'backbone',
	'settings',
	'model/ball'
],
function (

	Backbone,
	settings,
	ballModel
) {

	'use strict';


	return Backbone.Collection.extend({

		model: ballModel
	});
});
