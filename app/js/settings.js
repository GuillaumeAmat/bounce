

define([], function () {

	'use strict';

	return {

		'ballVelocity': .95,
		'ballSpeedStop': .5,
		'ballStartInertiaDelay': 100,

		'cos30': Math.round(Math.cos(30 * Math.PI / 180) *100) / 100,
		'cos45': Math.round(Math.cos(45 * Math.PI / 180) *100) / 100,
		'cos60': Math.round(Math.cos(60 * Math.PI / 180) *100) / 100,
		'sin30': Math.round(Math.sin(30 * Math.PI / 180) *100) / 100,
		'sin45': Math.round(Math.sin(45 * Math.PI / 180) *100) / 100,
		'sin60': Math.round(Math.sin(60 * Math.PI / 180) *100) / 100,

        'listColors' :  ['red', 'yellow', 'blue', 'aqua', 'pink', 'fuchsia', 'navy', 'lime'],
	};
});
