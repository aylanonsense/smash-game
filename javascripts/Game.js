define([
	'config',
	'display/draw',
	'display/camera',
	'entity/Croc',
	'level/Platform',
	'input/keyboard'
], function(
	config,
	draw,
	camera,
	Croc,
	Platform,
	keyboard
) {
	function Game(level) {
		//create fighters
		this.player = new Croc({ x: -200, y: -100, facing: 1, velX: 100 });
		this.fighters = [ this.player ];

		//create platforms
		this.platforms = [
			 new Platform({ x: -300, y: 0, width: 600, height: 50 }),
			 new Platform({ x: 150, y: -65, width: 50, height: 50 }),
			 new Platform({ x: 200, y: -130, width: 50, height: 50 }),
			 new Platform({ x: 0, y: -195, width: 100, height: 50 })
		];

		//adjust camera
		camera.pos.y = -500;

		//listen for inputs
		this.bufferedInputs = [];
		keyboard.on('key-event', function(key, isDown) {
			this.bufferedInputs.push({ key: key, isDown: isDown, state: keyboard.getState() });
		}, this);
	}
	Game.prototype.update = function() {
		//update/reset frame counters and the like
		for(var i = 0; i < this.fighters.length; i++) {
			this.fighters[i].startOfFrame();
		}

		//handle inputs
		var inputs = this.bufferedInputs;
		this.bufferedInputs = [];
		for(i = 0; i < inputs.length; i++) {
			this.player.handleInput(inputs[i].key, inputs[i].isDown, inputs[i].state);
		}

		//move platforms
		for(i = 0; i < this.platforms.length; i++) {
			this.platforms[i].move();
		}

		//move entity positions
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].move(this.platforms);
		}

		//prep for next frame
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].endOfFrame();
		}
	};
	Game.prototype.render = function() {
		//clear canvas
		draw.rect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, { fill: '#000', fixed: true });

		//draw platforms
		for(var i = 0; i < this.platforms.length; i++) {
			this.platforms[i].render();
		}

		//draw fighters
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].render();
		}
	};
	return Game;
});