define({
	//basic properties
	width: 54,
	height: 60,
	sprite: 'croc',

	//physics
	gravity: 850,
	jumpSpeed: 550,
	softMaxFallSpeed: 350,
	aboveMaxFallSpeedDeceleration: 500,
	absoluteMaxHorizontalSpeed: 9999,
	absoluteMaxVerticalSpeed: 9999,
	//standing physics
	standingDeceleration: 100,
	standingSoftMaxSpeed: 500,
	standingAboveMaxSpeedDeceleration: 200,
	//running physics
	runningAcceleration: 400,
	runningSoftMaxSpeed: 300,
	runningAboveMaxSpeedDeceleration: 500,
	runningWrongWayDeceleration: 500,
	//airborne physics
	airborneAcceleration: 300,
	airborneDeceleration: 300,
	airborneSoftMaxSpeed: 350,
	airborneAboveMaxSpeedDeceleration: 400,
	airborneTurnaroundDeceleration: 400,

	//states
	states: {
		standing: {
			animation: [
				{ spriteFrame: 0, frames: 8 },
				{ spriteFrame: 1, frames: 8 }
			]
		},
		standing_turnaround_start: {
			animation: [
				{ spriteFrame: 20, frames: 8 },
				{ spriteFrame: 20, frames: 8 }
			]
		},
		standing_turnaround_end: {
			animation: [
				{ spriteFrame: 21, frames: 8 }
			]
		},
		running: {
			animation: [
				{ spriteFrame: 12, frames: 8 },
				{ spriteFrame: 13, frames: 8 },
				{ spriteFrame: 14, frames: 8 },
				{ spriteFrame: 15, frames: 8 }
			]
		},
		run_start: {
			animation: [
				{ spriteFrame: 10, frames: 8 },
				{ spriteFrame: 11, frames: 8 }
			]
		},
		run_end: {
			animation: [
				{ spriteFrame: 16, frames: 8 },
				{ spriteFrame: 17, frames: 8 },
				{ spriteFrame: 18, frames: 8 }
			]
		},
		running_turnaround_start: {
			animation: [
				{ spriteFrame: 22, frames: 8 },
				{ spriteFrame: 23, frames: 8 }
			]
		},
		running_turnaround_end: {
			animation: [
				{ spriteFrame: 24, frames: 8 },
				{ spriteFrame: 25, frames: 8 }
			]
		},
		crouching: {
			animation: [
				{ spriteFrame: 4, frames: 8 },
				{ spriteFrame: 5, frames: 8 }
			]
		},
		crouch_start: {
			animation: [
				{ spriteFrame: 2, frames: 8 },
				{ spriteFrame: 3, frames: 8 }
			]
		},
		crouch_end: {
			animation: [
				{ spriteFrame: 6, frames: 8 },
				{ spriteFrame: 7, frames: 8 }
			]
		},
		jump_takeoff: {
			animation: [
				{ spriteFrame: 30, frames: 8 },
				{ spriteFrame: 31, frames: 8 }
			]
		},
		jump_landing: {
			animation: [
				{ spriteFrame: 34, frames: 8 },
				{ spriteFrame: 35, frames: 8 },
				{ spriteFrame: 36, frames: 8 },
				{ spriteFrame: 37, frames: 8 }
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