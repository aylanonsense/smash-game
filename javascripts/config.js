define({
	//rendering/canvas
	RENDER: true,
	CANVAS_WIDTH: 800,
	CANVAS_HEIGHT: 600,
	SPRITES: {
		croc: {
			path: '/sprites/croc.png',
			frameWidth: 100,
			frameHeight: 100,
			scale: 2,
			allowFlipping: true,
			center: { x: 46, y: 80 },
			boundingBox: { x: 27, y: 47, width: 35, height: 33 },
			color: '#318c23'
		},
		shield: {
			path: '/sprites/shield.png',
			frameWidth: 36,
			frameHeight: 36,
			scale: 2,
			allowFlipping: false,
			center: { x: 15, y: 36 },
			boundingBox: { x: 3, y: 3, width: 30, height: 30 }
		}
	},

	//input
	LOG_KEY_EVENTS: false,
	KEY_BINDINGS: {
		38: 'UP', 87: 'UP', //up arrow / w key
		37: 'LEFT', 65: 'LEFT', //left arrow / a key
		40: 'DOWN', 83: 'DOWN', //down arrow / s key
		39: 'RIGHT', 68: 'RIGHT', //right arrow / d key
		32: 'JUMP', //space bar
		16: 'BLOCK', //shift key
		//90: 'LIGHT', 74: 'LIGHT', //z key / j key
		//88: 'HEAVY', 75: 'HEAVY', //x key / k key
		//67: 'SPECIAL', 76: 'SPECIAL', //c key / l key
		//86: 'DASH', 70: 'DASH', //v key / f key
		// 27: 'ESCAPE', //esc key
		// 13: 'OK', //enter key
	},

	//frame rate
	CONSTANT_TIME_PER_FRAME: true,
	FRAMES_PER_SECOND: null, //null will use requestAnimationFrame
	TIME_SCALE: 1.0, //2.0 will run twice as fast, 0.5 will run at half speed

	//debug
	SHOW_FIGHTER_DEBUG_DATA: false,
	DRAW_SPRITE_BOUNDING_BOXES: false,

	//gameplay
	MAX_MOVEMENT_PER_STEP: 10
});