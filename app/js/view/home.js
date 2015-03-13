

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
	Marionette,
	Easeljs
) {

	'use strict';

	return Marionette.LayoutView.extend({

		template: JST['home.html'],

        ui:
        {
            "canvas": "#canvas"
        },



        onShow: function()
        {
            var self = this;

           //Create a stage by getting a reference to the canvas
            this._stage = new createjs.Stage("canvas");
			createjs.Touch.enable(this._stage);

			this._stage.enableMouseOver(10);
			this._stage.mouseMoveOutside = true;



            window.addEventListener('resize',
                    function(e)
                    {
                        self.onResize();
                    }
                , false);



            createjs.Ticker.addEventListener("tick", function(e){

                    self.onTick(e);
                });
            
            this.init();
        },

        onTick: function (event)
        {
            this._stage.update();
            // Actions carried out each tick (aka frame)
            if (!event.paused)
            {
                
           // Actions carried out when the Ticker is not paused.
            }
        },

       
        onResize: function ()
        {
            this.init();
        },


        init: function()
        {
            var self = this;

            
            this._stage.canvas.width = window.innerWidth;
            this._stage.canvas.height = window.innerHeight;     
            this._width = this._stage.canvas.width;
            this._height = this._stage.canvas.height;

            

            var fond = new createjs.Shape();
            fond.graphics.beginFill("#333").drawRect(0, 0, this._width, this._height);
            this._stage.addChild(fond);


            this._bloc2 = new createjs.Shape();
            this._bloc2.width = 100;
            this._bloc2.height = 5;
            this._bloc2.graphics.beginFill("red").drawRect(0, 0, this._bloc2.width, this._bloc2.height);
            this._bloc2.hyp = Math.sqrt(this._bloc2.width * this._bloc2.width + this._bloc2.height*this._bloc2.height);
            this._bloc2.x = 200;
            this._bloc2.y = 200;
            this._bloc2.rotation = 45;
            this._stage.addChild(this._bloc2);



            this._circle = new createjs.Shape();
            this._circle.radius = 10;
            this._circle.graphics.beginFill("red").drawCircle(0, 0, this._circle.radius);
            
            this._circle.x = 300;
            this._circle.y = 300;
            this._stage.addChild( this._circle);
            this._stage.update();

			this._circle.on('mousedown', function (e) {

				this.offset = {x: this.x - e.stageX, y: this.y - e.stageY};
			});

			this._circle.on('pressmove', function (e) {

				this.x = e.stageX + this.offset.x;
				this.y = e.stageY + this.offset.y;

                var hitPos = self._bloc2.globalToLocal(this.x, this.y);


               if(
                   self._bloc2.hitTest(hitPos.x, hitPos.y - 10)
                || self._bloc2.hitTest(hitPos.x - 10, hitPos.y)
                || self._bloc2.hitTest(hitPos.x, hitPos.y + 10)
                || self._bloc2.hitTest(hitPos.x + 10, hitPos.y)
                
                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(45*Math.PI/180)), hitPos.y - this.radius * Math.sin((45*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(60*Math.PI/180)), hitPos.y - this.radius * Math.sin((60*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(30*Math.PI/180)), hitPos.y - this.radius * Math.sin((30*Math.PI/180)))
                
                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(45*Math.PI/180)), hitPos.y + this.radius * Math.sin((45*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(60*Math.PI/180)), hitPos.y + this.radius * Math.sin((60*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(30*Math.PI/180)), hitPos.y + this.radius * Math.sin((30*Math.PI/180)))

                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(45*Math.PI/180)), hitPos.y - this.radius * Math.sin((45*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(60*Math.PI/180)), hitPos.y - this.radius * Math.sin((60*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x + (this.radius * Math.cos(30*Math.PI/180)), hitPos.y - this.radius * Math.sin((30*Math.PI/180)))

                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(45*Math.PI/180)), hitPos.y + this.radius * Math.sin((45*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(60*Math.PI/180)), hitPos.y + this.radius * Math.sin((60*Math.PI/180)))
                || self._bloc2.hitTest(hitPos.x - (this.radius * Math.cos(30*Math.PI/180)), hitPos.y + this.radius * Math.sin((30*Math.PI/180)))
                )
                {
                    console.log("true");
                }
                else
                {
                    console.log("false");
                }
			});


        },

        getWidthPercent: function (number)
        {
            return (this._width * number / 100);
        },
        
        getHeightPercent: function (number)
        {
            return (this._height * number / 100);
        },

        getXPercent: function (number)
        {
            return (this._width * number / 100);
        },

        getYPercent: function (number)
        {
            return (this._height * number / 100);
        },

        
	});
});
