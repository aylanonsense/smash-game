define([
	'json!data/config.json',
	'display/draw',
	'display/camera',
	'entity/fighter/Croc',
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
	function Game() {
		//create fighters
		this.player = new Croc({ x: -200, y: -200, facing: 1 });
		this.fighters = [ this.player ];

		//create platforms
		this.level = [
			new Platform({ x: -300, y: 0, width: 600, height: 50 }),
			new Platform({ x: 150, y: -65, width: 50, height: 50 }),
			new Platform({ x: 200, y: -130, width: 50, height: 50 }),
			new Platform({ x: 0, y: -195, width: 100, height: 50 })
		];

		//adjust camera
		camera.pos.x = 0;
		camera.pos.y = -150;
		camera.zoom = 1;

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

		//handle user inputs
		if(this.player) {
			for(i = 0; i < this.bufferedInputs.length; i++) {
				this.player.handleInput(this.bufferedInputs[i].key, this.bufferedInputs[i].isDown, this.bufferedInputs[i].state);
			}
		}
		this.bufferedInputs = [];

		//move entity positions
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].move(this.level);
		}

		//prep for next frame
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].endOfFrame();
		}
	};
	Game.prototype.render = function() {
		if(config.FOLLOW_PLAYER_WITH_CAMERA) {
			camera.pos.x = this.player.pos.x;
			camera.pos.y = this.player.pos.y - 75;
		}

		//clear canvas
		draw.rect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, { fill: '#000', fixed: true });

		//draw level
		for(var i = 0; i < this.level.length; i++) {
			this.level[i].render();
		}

		//draw fighters
		for(i = 0; i < this.fighters.length; i++) {
			this.fighters[i].render();
		}
	};
	return Game;
});