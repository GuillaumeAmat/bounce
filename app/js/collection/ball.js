

define([

	'backbone',
	'settings',
	'model/ball'
],
function (

	Backbone,
	settings,
	ballModel
) {

	'use strict';


	return Backbone.Collection.extend({

		model: ballModel,

        initialize: function() {
            this.bind('add', this.onModelAdded, this );
        },

        onModelAdded: function(model, collection) {
            var shape = model.get('shape');
            shape.x = 100 + (50*collection.length);
            model.set('shape', shape);
        }
	});
});
