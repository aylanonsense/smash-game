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
		this.player = new Croc({ x: -125, y: -200, facing: 1 });
		this.fighters = [ this.player, new Croc({ x: 275, y: 0, facing: -1 }) ];

		//create platforms
		this.level = [
			new Platform({ x: -600, y: 50, width: 250, height: 650 }),
			new Platform({ x: -350, y: 0, width: 700, height: 700 }),
			new Platform({ x: 350, y: 150, width: 400, height: 550 }),
			new Platform({ x: 550, y: -175, width: 125, height: 200 }),
			new Platform({ x: 25, y: -125, width: 125, height: 25 }),
			new Platform({ x: 150, y: -250, width: 125, height: 25 }),
			new Platform({ x: 25, y: -375, width: 125, height: 25 })
		];
		this.minX = -1100;
		this.maxX = 1250;
		this.minY = -800;
		this.maxY = 700;

		//adjust camera
		camera.pos.x = 75;
		camera.pos.y = -125;
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
		// var centerBetweenPlayers = this.fighters[0].pos.clone().average(this.fighters[1].pos);
		// camera.pos.set(centerBetweenPlayers);

		//clear canvas
		draw.rect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, { fill: '#000', fixed: true });
		draw.rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY, { stroke: '#fff', thickness: 2 });

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