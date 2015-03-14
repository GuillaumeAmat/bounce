

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
			'radius': 40,
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
			.drawCircle(0, 0, this.get('radius'));
			shape.x = this.get('x');
			shape.y = this.get('y');


			shape.on('mousedown', function (e) {

				self.onMouseDown(e);
			});

			shape.on('pressmove', function (e) {

				self.onPressMove(e);
			});

			shape.on('pressup', function (e) {

				self.onPressUp(e);
			});

			stage.addChild(shape);

			this.set('shape', shape);
		},

		onMouseDown: function (e) {

			var circle = this.get('shape');

			circle.removeAllEventListeners('tick');
			this.cleanLastPos();

			var x = circle.x - e.stageX,
			y = circle.y - e.stageY;

			circle.offset = { 'x': x, 'y': y };
		},

		onPressMove: function (e) {

			var circle = this.get('shape'),
			x = e.stageX + circle.offset.x,
			y = e.stageY + circle.offset.y;

			circle.x = x;
			circle.y = y;

			this.registerLastPos(x, y, e.timeStamp);
		},

		onPressUp: function (e) {

			var self = this,
			circle = this.get('shape'),
			speedX = 0,
			speedY = 0,
			x = e.stageX + circle.offset.x,
			y = e.stageY + circle.offset.y;

			this.registerLastPos(x, y, e.timeStamp);

			if ( this._lastPos.length <= 1 ) {

				return;
			}

			speedX = this._lastPos[0].x - this._lastPos[this._lastPos.length - 1].x;
			speedY = this._lastPos[0].y - this._lastPos[this._lastPos.length - 1].y;

			if (speedX > 200) {

				speedX = 200;
			}
			else if (speedX < -200) {

				speedX = -200;
			}

			if (speedY > 200) {

				speedY = 200;
			}
			else if (speedY < -200) {

				speedY = -200;
			}

			circle.on('tick', function (e) {

				this.x -= speedX;
				this.y -= speedY;

				var circleMinX = this.x - self.get('radius'),
				circleMaxX = this.x + self.get('radius'),
				circleMinY = this.y - self.get('radius'),
				circleMaxY = this.y + self.get('radius');


				if (circleMinX < 0) {

					this.x -= circleMinX * 2;
					speedX *= -1;
				}

				if (circleMaxX > self.get('stage').canvas.width) {

					this.x -= (circleMaxX - self.get('stage').canvas.width) * 2;
					speedX *= -1;
				}

				if (circleMinY < 0) {

					this.y -= circleMinY * 2;
					speedY *= -1;
				}

				if (circleMaxY > self.get('stage').canvas.height) {

					this.y -= (circleMaxY - self.get('stage').canvas.height) * 2;
					speedY *= -1;
				}

				speedX *= settings.ballVelocity;
				speedY *= settings.ballVelocity;

				if (
						speedX < settings.ballSpeedStop
						&& speedY < settings.ballSpeedStop
						&& speedX > -settings.ballSpeedStop
						&& speedY > -settings.ballSpeedStop
					) {

					this.removeAllEventListeners('tick');
				}
			});
		},

		registerLastPos: function (x, y, timeStamp) {

			this._lastPos.push({

				'x': x,
				'y': y,
				'timeStamp': timeStamp
			});

			if (this._lastPos.length >= 2) {

				var posDelay = this._lastPos[this._lastPos.length - 1].timeStamp - this._lastPos[this._lastPos.length - 2].timeStamp;

				if (posDelay > settings.ballStartInertiaDelay) {

					this.cleanLastPos();
					return;
				}
			}

			if (this._lastPos.length > 5) {

				this._lastPos.shift();
			}
		},

		cleanLastPos: function () {

			this._lastPos = [];
		},

		onDestroy: function () {

			var stage = this.get('stage'),
			shape = this.get('shape');

			shape.removeAllEventListeners('tick');
			return stage.removeChild(shape);
		},
	});
});
