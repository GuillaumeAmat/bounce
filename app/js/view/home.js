

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

           window.addEventListener('resize', resize, false);

           //Create a stage by getting a reference to the canvas
            var stage = new createjs.Stage("canvas");
            createjs.Ticker.addEventListener("tick", handleTick);
            stage.canvas.width = window.innerWidth;
            stage.canvas.height = window.innerHeight;     

            //Create a Shape DisplayObject.
            var circle = new createjs.Shape();
            circle.graphics.beginFill("red").drawCircle(0, 0, 40);
            //Set position of Shape instance.
            circle.x = circle.y = 50;
            //Add Shape instance to stage display list.
            stage.addChild(circle);
            //Update stage will render next frame

                stage.update();

            function handleTick(event)
            {
                stage.update();
                // Actions carried out each tick (aka frame)
                if (!event.paused)
                {
                // Actions carried out when the Ticker is not paused.
                }
            }

           
            function resize()
            { 
                stage.canvas.width = window.innerWidth;
                stage.canvas.height = window.innerHeight;     
            }
        }

        
	});
});
