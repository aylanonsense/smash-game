define([
	'config',
	'display/canvas',
	'util/EventHelper'
], function(
	config,
	canvas,
	EventHelper
) {
	var events = new EventHelper([ 'key-event' ]);
	var keyboardState = {};
	for(var key in config.KEY_BINDINGS) {
		keyboardState[config.KEY_BINDINGS[key]] = false;
	}

	//add keyboard handler
	function onKeyboardEvent(evt) {
		if(config.LOG_KEY_EVENTS) {
			console.log(evt.type, evt.which, config.KEY_BINDINGS[evt.which] || null);
		}
		// console.log(evt.which);
		var isDown = (evt.type === 'keydown');
		if(config.KEY_BINDINGS[evt.which]) {
			evt.preventDefault();
			if(keyboardState[config.KEY_BINDINGS[evt.which]] !== isDown) {
				keyboardState[config.KEY_BINDINGS[evt.which]] = isDown;
				events.trigger('key-event', config.KEY_BINDINGS[evt.which], isDown, keyboardState);
			}
		}
	}
	if(config.RENDER) {
		document.onkeyup = onKeyboardEvent;
		document.onkeydown = onKeyboardEvent;
	}

	return {
		on: function(eventName, callback, ctx) {
			events.on.apply(events, arguments);
		},
		getState: function() {
			return keyboardState;
		}
	};
});