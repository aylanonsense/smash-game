define(function() {
	var moveData = {
		standing: {
			deceleration: 600,
			animation: [
				{ sprite: 0, frames: 20 },
				{ sprite: 1, frames: 20 }
			]
		},
		crouch_start: {
			animation: [
				{ sprite: 6, frames: 1 },
				{ sprite: 7, frames: 1 }
			]
		},
		crouching: {
			animation: [
				{ sprite: 4, frames: 20 },
				{ sprite: 5, frames: 20 }
			]
		},
		crouch_end: {
			animation: [
				{ sprite: 6, frames: 10 },
				{ sprite: 7, frames: 6 }
			]
		},
		running: {
			maxSpeed: 275,
			acceleration: 1250,
			deceleration: 200,
			animation: [
				{ sprite: 8, frames: 10 },
				{ sprite: 9, frames: 10 },
				{ sprite: 10, frames: 10 },
				{ sprite: 11, frames: 10 }
			]
		},
		run_end: {
			animation: [
				{ sprite: 12, frames: 6 },
				{ sprite: 13, frames: 6 },
				{ sprite: 14, frames: 6 }
			]
		}
	};

	for(var key in moveData) {
		var totalFrames = 0;
		for(var i = 0; i < moveData[key].animation.length; i++) {
			totalFrames += moveData[key].animation[i].frames;
		}
		moveData[key].totalFrames = totalFrames;
	}

	return moveData;
});