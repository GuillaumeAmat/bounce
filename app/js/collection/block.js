

define([

	'backbone',
	'settings',
	'model/block'
],
function (

	Backbone,
	settings,
	blockModel
) {

	'use strict';


	return Backbone.Collection.extend({

		model: blockModel
	});
});
