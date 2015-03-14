

define([

	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'templates',
	'easeljs',
	'settings',
	'model/ball',
	'model/block',
	'collection/ball',
	'collection/block',
],
function (

	$,
	_,
	Backbone,
	Marionette,
	templates,
	EaselJS,
	settings,
	ballModel,
	blockModel,
	ballCollection,
	blockCollection
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

			this._blocks = new blockCollection();
			this._balls = new ballCollection();
		},

		onRender: function() {

			var self = this;

			this._stage = new createjs.Stage(this.ui.canvas[0]);

			createjs.Touch.enable(this._stage);

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
            var self = this;


            _.each(this._balls.models, function (ball)
            {
                var ballShape = ball.get('shape'),
                isHit = false;

                _.each(this._blocks.models, function (block)
                {
                    if ( isHit === false)
                    {
                        var blockShape = block.get('shape'),
                        hitPos = ballShape.localToLocal(0, 0, blockShape),
                        radius = ball.get('radius');


                        var radiusCos45 = (radius * settings.cos45),
                            radiusCos45 = (radius * settings.cos60),
                            radiusCos30 = (radius * settings.cos30),
                            radiusSin45 = (radius * settings.sin45),
                            radiusSin60 = (radius * settings.sin60),
                            radiusSin30 = (radius * settings.sin30);

                        if(
                               blockShape.hitTest(hitPos.x, hitPos.y - radius)
                            || blockShape.hitTest(hitPos.x, hitPos.y + radius)
                            || blockShape.hitTest(hitPos.x + radius, hitPos.y)
                            || blockShape.hitTest(hitPos.x - radius, hitPos.y)

                            || blockShape.hitTest(hitPos.x - radiusCos45, hitPos.y - radiusSin45)
                            || blockShape.hitTest(hitPos.x - radiusCos45, hitPos.y - radiusSin60)
                            || blockShape.hitTest(hitPos.x - radiusCos30, hitPos.y - radiusSin30)

                            || blockShape.hitTest(hitPos.x + radiusCos45, hitPos.y + radiusSin45)
                            || blockShape.hitTest(hitPos.x + radiusCos45, hitPos.y + radiusSin60)
                            || blockShape.hitTest(hitPos.x + radiusCos30, hitPos.y + radiusSin30)

                            || blockShape.hitTest(hitPos.x + radiusCos45, hitPos.y - radiusSin45)
                            || blockShape.hitTest(hitPos.x + radiusCos45, hitPos.y - radiusSin60)
                            || blockShape.hitTest(hitPos.x + radiusCos30, hitPos.y - radiusSin30)

                            || blockShape.hitTest(hitPos.x - radiusCos45, hitPos.y + radiusSin45)
                            || blockShape.hitTest(hitPos.x - radiusCos45, hitPos.y + radiusSin60)
                            || blockShape.hitTest(hitPos.x - radiusCos30, hitPos.y + radiusSin30)
                        )
                        {
                            isHit  = true;
                            this.checkContact(ball, block);
                            ball.destroy();
                        }
                    }
                }, this);
			}, this);



			if (!e.paused) {
				this._stage.update(e);
			}
		},

		onResize: function (e) {

			this.init();
		},


		init: function() {

            var self = this;

            this.score  = 0;

            this._stage.canvas.width = window.innerWidth;
            this._stage.canvas.height = window.innerHeight;



			if (this._fond) {

				this._stage.removeChild(this._fond);
			}

            this._fond = new createjs.Shape();
            this._fond.graphics.beginFill("#333").drawRect(0, 0, this._stage.canvas.width, this._stage.canvas.height);
            this._stage.addChild(this._fond);

            this.scoreText = new createjs.Text("Hello World", this.score, "#FFFFFF");
            this.scoreText.x = 300;
            this.scoreText.y = 50;
			this._stage.addChild(this.scoreText);
            
            


			var width = 100, height = 20;

			this._blocks.reset();


			this._blocks.add( new blockModel({

				'name2': 'Block2',
                'stage': this._stage,
				'fillColor': '#FF0000',
				'x': 200,
				'y': 50,
				'width': width,
				'height': height,
				'hyp': Math.sqrt(width * width + height * height),
				'regX': 50,
				'regY': 10,
				'rotation': 0,
			}));

			this._blocks.add( new blockModel({

				'name2': 'Block1',
				'stage': this._stage,
				'fillColor': '#FFFF00',
				'x': 80,
				'y': 90,
				'width': width,
				'height': height,
				'hyp': Math.sqrt(width * width + height * height),
				'regX': 50,
				'regY': 10,
				'rotation': -45,
			}));

			this._blocks.add( new blockModel({

				'name2': 'Block3',
				'stage': this._stage,
				'fillColor': '#FF00FF',
				'x': 320,
				'y': 90,
				'width': width,
				'height': height,
				'hyp': Math.sqrt(width * width + height * height),
				'regX': 50,
				'regY': 10,
				'rotation': 45,
			}));



			this._balls.reset();
            this.addBall();
            this.addBall();
            this.addBall();
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

			return this._blocks;
		},

		onRequestBalls: function () {

			return this._balls;
		},

        checkContact: function(ball, block) {

            if (ball.get('fillColor') == block.get('fillColor'))
            {
                this.score++;
            }
            else
            {
                this.score--;
            }

            this.scoreText.text = this.score;
            this.addBall();
        },
        
        addBall: function() {

            this._balls.add(new ballModel({

				'stage': this._stage,
				'fillColor': '#FF0000',
				'x': 100,
				'y': 500,
				'radius': 20,
			}));
        }
	});
});
