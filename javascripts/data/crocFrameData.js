define({
	//basic properties
	width: 54,
	height: 60,
	sprite: 'croc',

	//physics
	gravity: 800,
	jumpSpeed: 375,
	jumpHorizontalSpeed: 100,
	softMaxFallSpeed: 375,
	aboveMaxFallSpeedDeceleration: 50,
	absoluteMaxHorizontalSpeed: 9999,
	absoluteMaxVerticalSpeed: 9999,
	//standing physics
	standingDeceleration: 800,
	standingSoftMaxSpeed: 300,
	standingAboveMaxSpeedDeceleration: 800,
	//running physics
	runningSoftMaxSpeed: 300,
	runningAcceleration: 1000,
	runningWrongWayDeceleration: 1100,
	runningAboveMaxSpeedDeceleration: 1100,
	//airborne physics
	airborneSoftMaxSpeed: 250,
	airborneAcceleration: 500,
	airborneDeceleration: 50,
	airborneTurnaroundDeceleration: 500,
	airborneAboveMaxSpeedDeceleration: 100,

	//states
	states: {
		standing: {
			animation: [
				{ spriteFrame: 0, frames: 40 },
				{ spriteFrame: 1, frames: 40 }
			]
		},
		standing_turnaround_start: {
			runningAcceleration: 300,
			runningWrongWayDeceleration: 0,
			animation: [
				{ spriteFrame: 20, frames: 2 },
				{ spriteFrame: 20, frames: 4, frameCancels: [ 'standing_turnaround_start' ] }
			]
		},
		standing_turnaround_end: {
			animation: [
				{ spriteFrame: 21, frames: 6, frameCancels: [ 'run_start' ] }
			]
		},
		running: {
			animation: [
				{ spriteFrame: 12, frames: 7 },
				{ spriteFrame: 13, frames: 7 },
				{ spriteFrame: 14, frames: 7 },
				{ spriteFrame: 15, frames: 7 }
			]
		},
		run_start: {
			runningAcceleration: 1300,
			animation: [
				{ spriteFrame: 10, frames: 2, frameCancels: [ 'standing_turnaround_start' ] },
				{ spriteFrame: 10, frames: 3, frameCancels: [ 'standing_turnaround_start', 'run_end_quick', ] },
				{ spriteFrame: 11, frames: 5, frameCancels: [ 'running_turnaround_start', 'run_end_quick' ] }
			]
		},
		run_end_quick: {
			animation: [
				{ spriteFrame: 17, frames: 4 },
				{ spriteFrame: 18, frames: 4 }
			]
		},
		run_end: {
			animation: [
				{ spriteFrame: 16, frames: 6, frameCancels: [] },
				{ spriteFrame: 17, frames: 6, frameCancels: [ 'run_start', 'running_turnaround_start' ] },
				{ spriteFrame: 18, frames: 6, frameCancels: [ 'run_start', 'standing_turnaround_start' ] }
			]
		},
		running_turnaround_start: {
			runningAcceleration: 1300,
			animation: [
				{ spriteFrame: 22, frames: 3, runningWrongWayDeceleration: 600 },
				{ spriteFrame: 23, frames: 4, runningWrongWayDeceleration: 8000 }
			]
		},
		running_turnaround_end: {
			runningAcceleration: 1300,
			animation: [
				{ spriteFrame: 24, frames: 4 },
				{ spriteFrame: 25, frames: 4 }
			]
		},
		crouching: {
			standingDeceleration: 450,
			animation: [
				{ spriteFrame: 4, frames: 14 },
				{ spriteFrame: 5, frames: 14 }
			]
		},
		crouch_start: {
			standingDeceleration: 450,
			animation: [
				{ spriteFrame: 2, frames: 6 },
				{ spriteFrame: 3, frames: 6 }
			]
		},
		crouch_end: {
			animation: [
				{ spriteFrame: 6, frames: 6 },
				{ spriteFrame: 7, frames: 5, frameCancels: [ 'standing_turnaround_start', 'run_start' ] }
			]
		},
		jump_takeoff: {
			airborneDeceleration: 0,
			animation: [
				{ spriteFrame: 30, frames: 3 },
				{ spriteFrame: 31, frames: 3 }
			]
		},
		jump_landing: {
			standingDeceleration: 500,
			animation: [
				{ spriteFrame: 34, frames: 3 },
				{ spriteFrame: 35, frames: 5 },
				{ spriteFrame: 36, frames: 7, frameCancels: [ 'standing_turnaround_start', 'run_start', 'crouch_start' ] },
				{ spriteFrame: 37, frames: 7, frameCancels: [ 'standing_turnaround_start', 'run_start', 'crouch_start' ] }
			]
		},
		airborne: {
			animation: [
				{ spriteFrame: 32, frames: 8 },
				{ spriteFrame: 33, frames: 8 }
			]
		},
		airborne_falloff: {
			animation: [
				{ spriteFrame: 40, frames: 8 },
				{ spriteFrame: 41, frames: 8 },
				{ spriteFrame: 42, frames: 8 }
			]
		}
	}
});