

define([

	'jquery',
	'backbone',
	'marionette',
	'templates',
	'easeljs',
	'settings',
	'actor/ball',
	'actor/block',
],
function (

	$,
	Backbone,
	Marionette,
	templates,
	EaselJS,
	settings,
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
			this._radio.reqres.setHandler('balls', this.onRequestBalls, this);
		},

		onRender: function() {

			var self = this;

			this._stage = new createjs.Stage(this.ui.canvas[0]);

			createjs.Touch.enable(this._stage);

			this._stage.enableMouseOver(10);
			this._stage.mouseMoveOutside = true;


			createjs.Ticker.addEventListener('tick', function (e){

				self.onTick(e);
			});


			$(window).on('resize', function (e) {

				self.onResize(e);
			})
			.trigger('resize');
		},

		onTick: function (e)
        {

            var self = this,
			blocks = this._radio.reqres.request('blocks'),
			balls = this._radio.reqres.request('balls');

            console.log(blocks);

			blocks.forEach(function (blockActor)
            {

                balls.forEach(function (ballActor)
                {

                    var block = blockActor.getShape(),
                    ball = ballActor.getShape(),
                    hitPos = ball.localToLocal(0, 0, block),
					radius = ballActor.getOption('radius');


                    var radiusCos45 = (radius * settings.cos45),
                        radiusCos45 = (radius * settings.cos60),
                        radiusCos30 = (radius * settings.cos30),
                        radiusSin45 = (radius * settings.sin45),
                        radiusSin60 = (radius * settings.sin60),
                        radiusSin30 = (radius * settings.sin30);

                    if(
                           block.hitTest(hitPos.x, hitPos.y - radius)
                        || block.hitTest(hitPos.x, hitPos.y + radius)
                        || block.hitTest(hitPos.x + radius, hitPos.y)
                        || block.hitTest(hitPos.x - radius, hitPos.y)

                        || block.hitTest(hitPos.x - radiusCos45, hitPos.y - radiusSin45)
                        || block.hitTest(hitPos.x - radiusCos45, hitPos.y - radiusSin60)
                        || block.hitTest(hitPos.x - radiusCos30, hitPos.y - radiusSin30)
                                                                                  
                        || block.hitTest(hitPos.x + radiusCos45, hitPos.y + radiusSin45)
                        || block.hitTest(hitPos.x + radiusCos45, hitPos.y + radiusSin60)
                        || block.hitTest(hitPos.x + radiusCos30, hitPos.y + radiusSin30)
                                                                                  
                        || block.hitTest(hitPos.x + radiusCos45, hitPos.y - radiusSin45)
                        || block.hitTest(hitPos.x + radiusCos45, hitPos.y - radiusSin60)
                        || block.hitTest(hitPos.x + radiusCos30, hitPos.y - radiusSin30)
                                                                                  
                        || block.hitTest(hitPos.x - radiusCos45, hitPos.y + radiusSin45)
                        || block.hitTest(hitPos.x - radiusCos45, hitPos.y + radiusSin60)
                        || block.hitTest(hitPos.x - radiusCos30, hitPos.y + radiusSin30)
                    )
                    {
                        ball.alpha = 1;
                    }
                    else
                    {
                        ball.alpha = 0.2;
                    }
                });
			});



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

			var width = 100, height = 20;

            this._blocks = new Array();
            
			this._blocks.push(new blockActor({

				'stage': this._stage,
				'fillColor': '#FFFF00',
				'x': 50,
				'y': 50,
				'width': width,
				'height': height,
				'rotation': -45,
				'hyp': Math.sqrt(width * width + height * height),
			}));

			this._blocks.push(new blockActor({

				'stage': this._stage,
				'fillColor': '#FF0000',
				'x': 150,
				'y': 50,
				'width': width,
				'height': height,
				'rotation': 0,
				'hyp': Math.sqrt(width * width + height * height),
			}));

			this._blocks.push(new blockActor({

				'stage': this._stage,
				'fillColor': '#FF00FF',
				'x': 250,
				'y': 50,
				'width': width,
				'height': height,
				'rotation': 45,
				'hyp': Math.sqrt(width * width + height * height),
			}));



			if (this._ball) {

				this._ball.destroy();
			}

			this._ball = new ballActor({

				'stage': this._stage,
				'fillColor': '#bada55',
				'x': 100,
				'y': 500,
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

			if (!this._blocks) {

				return false;
			}

			return this._blocks;
		},

		onRequestBalls: function () {

			if (!this._ball) {

				return false;
			}

			return [this._ball];
		}
	});
});
