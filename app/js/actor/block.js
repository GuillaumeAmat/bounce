

define([

	'underscore',
	'backbone',
	'marionette',
	'easeljs',
],
function (

	_,
	Backbone
) {

	'use strict';

	var defaultOptions = {

		'stage': null,
		'fillColor': 'black',
		'x': 0,
		'y': 0,
		'radius': 40,
		'width': 40,
		'height': 40,
		'rotation': 0,
		'hyp': Math.sqrt(40 * 40 + 40 * 40),
	};

	var actor = function(options) {

		if (!options.stage) {

			return false;
		}

		this._radio = Backbone.Wreqr.radio.channel('global');

		this._options = _.extend({}, defaultOptions, options);

		var self = this;

		this._stage = this._options.stage;
		this._block = new createjs.Shape();

		this._block.graphics
		.beginFill(this._options.fillColor)
		.drawRect(0, 0, this._options.width, this._options.height);
		this._block.x = this._options.x;
		this._block.y = this._options.y;

		this._block.rotation = this._options.rotation;

		this._stage.addChild(this._block);

		return this;
	}

	actor.prototype.destroy = function () {

		this._circle.removeAllEventListeners('tick');
		return this._stage.removeChild(this._block);
	}

	actor.prototype.getShape = function () {

		return this._block;
	}

	return actor;
});
