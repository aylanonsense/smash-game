define([
	'config',
	'display/draw',
	'display/camera',
	'level/Platform',
	'entity/Fighter',
	'input/fighterInputs'
], function(
	config,
	draw,
	camera,
	Platform,
	Fighter,
	fighterInputs
) {
	function Game(level) {
		//create players
		fighterInputs.popRecentInputs();
		var player1 = new Fighter({
			x: -200,
			y: -100,
			facing: 1,
			inputState: fighterInputs.getState()
		});
		this.player = player1;
		this.entities = [ player1 ];
		this.platforms = [
			 new Platform({
			 	x: -300,
			 	y: 0,
			 	width: 600,
			 	height: 50
			 }),
			 new Platform({
			 	x: 150,
			 	y: -65,
			 	width: 50,
			 	height: 50
			 }),
			 new Platform({
			 	x: 200,
			 	y: -130,
			 	width: 50,
			 	height: 50
			 }),
			 new Platform({
			 	x: 0,
			 	y: -195,
			 	width: 100,
			 	height: 50
			 })
		];
		camera.pos.y = -500;
	}
	Game.prototype.update = function(t) {
		//move positions
		for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].startOfFrame(t);
		}

		//handle inputs
		this.player.handleInput(fighterInputs.popRecentInputs(), fighterInputs.getState());

		//move positions
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].move(t, this.platforms);
		}

		//check for hits
		//TODO
	};
	Game.prototype.render = function() {
		draw.rect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, { fill: '#000', fixed: true });
		for(var i = 0; i < this.platforms.length; i++) {
			this.platforms[i].render();
		}
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	};
	return Game;
});