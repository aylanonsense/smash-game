define(function() {
	var moveData = {
		standing: {
			deceleration: 600,
			animation: [
				{ sprite: 0, frames: 20 },
				{ sprite: 1, frames: 20 }
			]
		},
		standing_turnaround_start: {
			maxSpeed: 275,
			acceleration: 600,
			deceleration: 600,
			animation: [
				{ sprite: 20, frames: 8 }
			]
		},
		standing_turnaround_end: {
			animation: [
				{ sprite: 21, frames: 8 }
			]
		},
		running_turnaround_start: {
			maxSpeed: 275,
			acceleration: 1200,
			deceleration: 600,
			animation: [
				{ sprite: 22, frames: 8 },
				{ sprite: 23, frames: 8 }
			]
		},
		running_turnaround_end: {
			animation: [
				{ sprite: 24, frames: 8 },
				{ sprite: 25, frames: 8 }
			]
		},
		crouch_start: {
			animation: [
				{ sprite: 2, frames: 8 },
				{ sprite: 3, frames: 8 }
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
		run_start: {
			animation: [
				{ sprite: 10, frames: 6 },
				{ sprite: 11, frames: 6 }
			]
		},
		running: {
			maxSpeed: 275,
			acceleration: 1250,
			deceleration: 200,
			animation: [
				{ sprite: 12, frames: 10 },
				{ sprite: 13, frames: 10 },
				{ sprite: 14, frames: 10 },
				{ sprite: 15, frames: 10 }
			]
		},
		run_end: {
			animation: [
				{ sprite: 16, frames: 6 },
				{ sprite: 17, frames: 6 },
				{ sprite: 18, frames: 6 }
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