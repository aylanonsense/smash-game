define(function() {
	var moveData = {
		standing: {
			deceleration: 1100,
			animation: [
				{ sprite: 0, frames: 12 },
				{ sprite: 1, frames: 12 }
			]
		},
		running: {
			maxSpeed: 300,
			acceleration: 800,
			cancels: [ 'crouch_start' ],
			animation: [
				{ sprite: 12, frames: 8 },
				{ sprite: 13, frames: 8 },
				{ sprite: 14, frames: 8 },
				{ sprite: 15, frames: 8 }
			]
		},
		standing_turnaround_start: {
			acceleration: 1500,
			animation: [
				{ sprite: 20, frames: 3 },
				{ sprite: 20, frames: 3, cancels: [ 'standing_turnaround_start' ] }
			]
		},
		standing_turnaround_end: {
			cancels: [ 'standing_turnaround_start', 'crouch_start' ],
			animation: [
				{ sprite: 21, frames: 4 }
			]
		},
		running_turnaround_start: {
			acceleration: 3000,
			cancels: [ 'standing_turnaround_start' ],
			animation: [
				{ sprite: 22, frames: 4 },
				{ sprite: 23, frames: 4 }
			]
		},
		running_turnaround_end: {
			animation: [
				{ sprite: 24, frames: 4 },
				{ sprite: 25, frames: 4, cancels: [ 'running_turnaround_start', 'crouch_start' ] }
			]
		},
		crouch_start: {
			deceleration: 500,
			animation: [
				{ sprite: 2, frames: 4 },
				{ sprite: 3, frames: 4, cancels: [ 'crouch_end' ] }
			]
		},
		crouching: {
			deceleration: 500,
			animation: [
				{ sprite: 4, frames: 12 },
				{ sprite: 5, frames: 12 }
			]
		},
		crouch_end: {
			animation: [
				{ sprite: 6, frames: 5 },
				{ sprite: 7, frames: 4, cancels: [ 'run_start', 'standing_turnaround_start' ] }
			]
		},
		run_start: {
			acceleration: 1500,
			animation: [
				{ sprite: 10, frames: 4 },
				{ sprite: 11, frames: 4, cancels: [ 'run_end' ] }
			]
		},
		run_end: {
			earlyCancelFrame: 6,
			cancels: [ 'crouch_start' ],
			animation: [
				{ sprite: 16, frames: 3, cancels: [ 'running_turnaround_start' ] },
				{ sprite: 17, frames: 3, cancels: [ 'running_turnaround_start' ] },
				{ sprite: 18, frames: 3, cancels: [ 'standing_turnaround_start' ] }
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