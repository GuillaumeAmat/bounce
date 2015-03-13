

define([

	'jquery',
	'backbone',
	'marionette',
	'templates',
	'easeljs',
	'actor/ball',
	'actor/block',
],
function (

	$,
	Backbone,
	Marionette,
	templates,
	EaselJS,
	ballActor,
	blockActor
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['home.html'],

		ui: {

			'canvas': '#canvas',
		},

		initialize: function () {

			this._radio = Backbone.Wreqr.radio.channel('global');

			this._radio.reqres.setHandler('blocks', this.onRequestBlocks, this);
		},

		onRender: function() {

			var self = this;

			this._stage = new createjs.Stage(this.ui.canvas[0]);

			createjs.Touch.enable(this._stage);

			this._stage.enableMouseOver(10);
			this._stage.mouseMoveOutside = true;


			createjs.Ticker.addEventListener('tick', function (e) {

				self.onTick(e);
			});


			$(window).on('resize', function (e) {

				self.onResize(e);
			})
			.trigger('resize');
		},

		onTick: function (e) {

			if (!e.paused) {

				this._stage.update(e);
			}
		},

		onResize: function (e) {

			this.init();
		},


		init: function() {

            var self = this;

            this._stage.canvas.width = window.innerWidth;
            this._stage.canvas.height = window.innerHeight;


			if (this._fond) {

				this._stage.removeChild(this._fond);
			}

            this._fond = new createjs.Shape();
            this._fond.graphics.beginFill("#333").drawRect(0, 0, this._stage.canvas.width, this._stage.canvas.height);
            this._stage.addChild(this._fond);



			if (this._block) {

				this._block.destroy();
			}

			var width = 100, height = 5;
			this._block = new blockActor({

				'stage': this._stage,
				'fillColor': '#7355D9',
				'x': 200,
				'y': 200,
				'width': width,
				'height': height,
				'rotation': 0,
				'hyp': Math.sqrt(width * width + height * height),
			});



			if (this._ball) {

				this._ball.destroy();
			}

			this._ball = new ballActor({

				'stage': this._stage,
				'fillColor': '#bada55',
				'x': 100,
				'y': 100,
				'radius': 20,
			});
        },

        getWidthPercent: function (number) {

            return (this._stage.canvas.width * number / 100);
        },

        getHeightPercent: function (number) {

            return (this._stage.canvas.height * number / 100);
        },

        getXPercent: function (number) {

            return (this._stage.canvas.width * number / 100);
        },

        getYPercent: function (number) {

            return (this._stage.canvas.height * number / 100);
        },

		onRequestBlocks: function () {

			if (!this._block) {

				return false;
			}

			return [this._block];
		}
	});
});
