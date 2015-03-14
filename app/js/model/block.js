

define([

	'underscore',
	'backbone',
	'marionette',
	'easeljs',
	'settings'
],
function (

	_,
	Backbone,
	Marionette,
	EaselJS,
	settings
) {

	'use strict';


	return Backbone.Model.extend({

		defaults: {

			'stage': null,
			'shape': null,
			'fillColor': 'black',
			'x': 0,
			'y': 0,
			'width': 40,
			'height': 40,
			'hyp': Math.sqrt(40 * 40 + 40 * 40),
			'regX': 0,
			'regY': 0,
			'rotation': 0,
		},

		initialize: function () {

			this.on('destroy', this.onDestroy, this);

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._lastPos = [];

			var self = this,
			shape = new createjs.Shape(),
			stage = this.get('stage');

			shape.graphics
			.beginFill(this.get('fillColor'))
			.drawRect(0, 0, this.get('width'), this.get('height'));
			shape.x = this.get('x');
			shape.y = this.get('y');
			shape.regX = this.get('regX');
			shape.regY = this.get('regY');
			shape.rotation = this.get('rotation');

			stage.addChild(shape);

			this.set('shape', shape);
		},

		onDestroy: function () {

			var stage = this.get('stage'),
			shape = this.get('shape');

			shape.removeAllEventListeners('tick');
			return stage.removeChild(shape);
		},
	});
});
