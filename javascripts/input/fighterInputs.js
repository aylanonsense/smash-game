define([
	'input/keyboard'
], function(
	keyboard
) {
	var inputs = [];

	//state
	var horizontalDir = 0; //-1: left, 1: right
	var verticalDir = 0; //-1: down, 1: up

	keyboard.on('key-event', function(key, isDown, state) {
		var dir, prevState = getState();

		//change horizontal direction
		if(key === 'LEFT' || key === 'RIGHT') {
			if(key === 'LEFT' && isDown) { dir = -1; }
			else if(key === 'LEFT' && !isDown) { dir = state.RIGHT ? 1 : 0; }
			else if(key === 'RIGHT' && isDown) { dir = 1; }
			else if(key === 'RIGHT' && !isDown) { dir = state.LEFT ? -1 : 0; }
			if(dir !== horizontalDir) {
				horizontalDir = dir;
				inputs.push({
					state: getState(),
					prevState: prevState
				});
			}
		}

		//change horizontal direction
		else if(key === 'UP' || key === 'DOWN') {
			if(key === 'UP' && isDown) { dir = 1; }
			else if(key === 'UP' && !isDown) { dir = state.DOWN ? -1 : 0; }
			else if(key === 'DOWN' && isDown) { dir = -1; }
			else if(key === 'DOWN' && !isDown) { dir = state.UP ? 1 : 0; }
			if(dir !== verticalDir) {
				verticalDir = dir;
				inputs.push({
					state: getState(),
					prevState: prevState
				});
			}
		}

		//jump
		else if(key === 'JUMP') {
			inputs.push({
				key: key,
				isDown: isDown,
				state: getState(),
				prevState: prevState
			});
		}
	});

	function getState() {
		return {
			horizontalDir: horizontalDir,
			verticalDir: verticalDir
		};
	}

	return {
		getState: getState,
		popRecentInputs: function() {
			var inputsToReturn = inputs;
			inputs = [];
			return inputsToReturn;
		}
	};
});