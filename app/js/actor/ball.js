

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
		'x': 0,
		'y': 0,
		'radius': 40,
		'fillColor': 'black'
	};

	var actor = function(options) {

		if (!options.stage) {

			return false;
		}

		this._radio = Backbone.Wreqr.radio.channel('global');

		this._options = _.extend({}, defaultOptions, options);

		var self = this;

		this._lastPos = [];
		this._stage = this._options.stage;
		this._circle = new createjs.Shape();

		this._circle.graphics
		.beginFill(this._options.fillColor)
		.drawCircle(0, 0, this._options.radius);
		this._circle.x = this._options.x;
		this._circle.y = this._options.y;


		this._circle.on('mousedown', function (e) {

			self.onMouseDown(e);
		});

		this._circle.on('pressmove', function (e) {

			self.onPressMove(e);
		});

		this._circle.on('pressup', function (e) {

			self.onPressUp(e);
		});

		this._stage.addChild(this._circle);

		return this;
	}

	actor.prototype.onMouseDown = function (e) {

		this._circle.removeAllEventListeners('tick');
		this.cleanLastPos();

		var x = this._circle.x - e.stageX,
		y = this._circle.y - e.stageY;

		this._circle.offset = { 'x': x, 'y': y };
	}

	actor.prototype.onPressMove = function (e) {

		var x = e.stageX + this._circle.offset.x,
		y = e.stageY + this._circle.offset.y;

		this._circle.x = x;
		this._circle.y = y;

		this.registerLastPos(x, y);
	}

	actor.prototype.onPressUp = function (e) {

		var self = this,
		speedX = this._lastPos[0].x - this._lastPos[this._lastPos.length - 1].x,
		speedY = this._lastPos[0].y - this._lastPos[this._lastPos.length - 1].y;

		this._circle.on('tick', function (e) {

			var circleMinX = this.x - self._options.radius,
			circleMaxX = this.x + self._options.radius,
			circleMinY = this.y - self._options.radius,
			circleMaxY = this.y + self._options.radius,
			circlePos = this.globalToLocal(this.x, this.y),
			// stageMin = { 'x': 0, 'y': 0 },
			// stageMax = { 'x': self._stage.canvas.width, 'y': self._stage.canvas.height };
			stageMin = this.localToGlobal(0, 0),
			stageMax = this.localToGlobal(self._stage.canvas.width, self._stage.canvas.height);

			// if (circleMinX < stageMin.x || circleMaxX > stageMax.x) {
			//
			// 	speedX *= -1;
			// }
			//
			// if (circleMinY < stageMin.y || circleMaxY > stageMax.y) {
			//
			// 	speedY *= -1;
			// }

			this.x -= speedX;
			this.y -= speedY;
			speedX *= .95;
			speedY *= .95;

			if (speedX < 0.5 && speedY < 0.5 && speedX > -0.5 && speedY > -0.5) {

				this.removeAllEventListeners('tick');
			}


			
		});
	}

	actor.prototype.registerLastPos = function (x, y) {

		this._lastPos.push({ 'x': x, 'y': y });

		if (this._lastPos.length > 5) {

			this._lastPos.shift();
		}
	}

	actor.prototype.cleanLastPos = function () {

		this._lastPos = [];
	}

	actor.prototype.destroy = function () {

		this._circle.removeAllEventListeners('tick');
		return this._stage.removeChild(this._circle);
	}

	actor.prototype.getShape = function () {

		return this._circle;
	}

	return actor;
});
