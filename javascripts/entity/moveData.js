define(function() {
	var moveData = {
		standing: {
			physics: 'standing',
			deceleration: 1100,
			animation: [
				{ sprite: 0, frames: 12 },
				{ sprite: 1, frames: 12 }
			]
		},
		running: {
			physics: 'running',
			maxSpeed: 300,
			acceleration: 800,
			aboveMaxSpeedDeceleration: 600,
			cancels: [ 'crouch_start' ],
			animation: [
				{ sprite: 12, frames: 8 },
				{ sprite: 13, frames: 8 },
				{ sprite: 14, frames: 8 },
				{ sprite: 15, frames: 8 }
			]
		},
		standing_turnaround_start: {
			physics: 'running',
			animation: [
				{ sprite: 20, frames: 3 },
				{ sprite: 20, frames: 3, cancels: [ 'standing_turnaround_start' ] }
			]
		},
		standing_turnaround_end: {
			physics: 'standing',
			cancels: [ 'standing_turnaround_start', 'crouch_start' ],
			animation: [
				{ sprite: 21, frames: 4 }
			]
		},
		running_turnaround_start: {
			physics: 'running',
			cancels: [ 'standing_turnaround_start' ],
			animation: [
				{ sprite: 22, frames: 4 },
				{ sprite: 23, frames: 4 }
			]
		},
		running_turnaround_end: {
			physics: 'running',
			acceleration: 2000,
			animation: [
				{ sprite: 24, frames: 4 },
				{ sprite: 25, frames: 4, cancels: [ 'running_turnaround_start', 'crouch_start' ] }
			]
		},
		crouch_start: {
			physics: 'standing',
			deceleration: 500,
			animation: [
				{ sprite: 2, frames: 4 },
				{ sprite: 3, frames: 4, cancels: [ 'crouch_end' ] }
			]
		},
		crouching: {
			physics: 'standing',
			deceleration: 500,
			animation: [
				{ sprite: 4, frames: 12 },
				{ sprite: 5, frames: 12 }
			]
		},
		crouch_end: {
			physics: 'standing',
			animation: [
				{ sprite: 6, frames: 5 },
				{ sprite: 7, frames: 4, cancels: [ 'run_start', 'standing_turnaround_start' ] }
			]
		},
		run_start: {
			physics: 'running',
			acceleration: 1500,
			animation: [
				{ sprite: 10, frames: 4 },
				{ sprite: 11, frames: 4, cancels: [ 'run_end' ] }
			]
		},
		run_end: {
			physics: 'standing',
			earlyCancelFrame: 6,
			cancels: [ 'crouch_start' ],
			animation: [
				{ sprite: 16, frames: 3, cancels: [ 'running_turnaround_start' ] },
				{ sprite: 17, frames: 3, cancels: [ 'running_turnaround_start' ] },
				{ sprite: 18, frames: 3, cancels: [ 'standing_turnaround_start' ] }
			]
		},
		jump_takeoff: {
			physics: 'standing',
			jumpSpeed: 350,
			deceleration: 0,
			animation: [
				{ sprite: 30, frames: 4 },
				{ sprite: 31, frames: 3 }
			]
		},
		airborne: {
			physics: 'airborne',
			gravity: 850,
			maxSpeed: 250,
			acceleration: 500,
			deceleration: 200,
			aboveMaxSpeedDeceleration: 600,
			animation: [
				{ sprite: 32, frames: 12 },
				{ sprite: 33, frames: 12 }
			]
		},
		ground_landing: {
			physics: 'standing',
			deceleration: 500,
			animation: [
				{ sprite: 34, frames: 3 },
				{ sprite: 35, frames: 5, cancels: [ 'jump_takeoff', 'run_start', 'standing_turnaround_start', 'crouching' ] },
				{ sprite: 36, frames: 5, cancels: [ 'jump_takeoff', 'run_start', 'standing_turnaround_start', 'crouching' ] },
				{ sprite: 37, frames: 5, cancels: [ 'jump_takeoff', 'run_start', 'standing_turnaround_start' ] }
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