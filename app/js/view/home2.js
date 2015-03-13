

define([

	'jquery',
	'backbone',
	'marionette',
	'templates',
	'easeljs',
],
function (

	$,
	Backbone,
	Marionette
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['home.html'],

		ui: {

			'canvas': '#canvas',
		},

		onRender: function() {

			var self = this;

			this._stage = new createjs.Stage(this.ui.canvas[0]);

			createjs.Touch.enable(this._stage);

			this._stage.enableMouseOver(10);
			this._stage.mouseMoveOutside = true;




			this._circle = new createjs.Shape();

			this._circle.graphics
			.beginFill('red')
			.drawCircle(0, 0, 40);

			this._circle.x = this._circle.y = 50;

			this._circle.on('mousedown', function (e) {

				this.offset = {x: this.x - e.stageX, y: this.y - e.stageY};
			});

			this._circle.on('pressmove', function (e) {

				this.x = e.stageX + this.offset.x;
				this.y = e.stageY + this.offset.y;
			});

			this._stage.addChild(this._circle);




			$(window).on('resize', function (e) {

				self.onResize(e);
			})
			.trigger('resize');


			createjs.Ticker.addEventListener('tick', function (e) {

				self.onTick(e);
			});
		},

		onTick: function (e) {

			if (!e.paused) {

				this._stage.update(e);
			}
		},

		onResize: function (e) {

			this._stage.canvas.width = window.innerWidth;
			this._stage.canvas.height = window.innerHeight;
		},
	});
});
