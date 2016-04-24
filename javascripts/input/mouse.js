define([
	'config',
	'display/canvas',
	'util/EventHelper'
], function(
	config,
	canvas,
	EventHelper
) {
	var events = new EventHelper([ 'mouse-event' ]);

	//add mouse handler
	function onMouseEvent(evt) {
		evt.preventDefault();
		events.trigger('mouse-event', evt.type,
			evt.clientX - canvas.offsetLeft + document.body.scrollLeft,
			evt.clientY - canvas.offsetTop + document.body.scrollTop);
	}
	if(config.RENDER) {
		canvas.onmousedown = onMouseEvent;
		document.onmouseup = onMouseEvent;
		document.onmousemove = onMouseEvent;
	}

	return {
		on: function(eventName, callback, ctx) {
			events.on.apply(events, arguments);
		}
	};
});