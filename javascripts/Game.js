define([
	'config',
	'display/draw',
	'display/camera',
	'entity/Fighter',
	'input/fighterInputs'
], function(
	config,
	draw,
	camera,
	Fighter,
	fighterInputs
) {
	function Game(level) {
		//create players
		fighterInputs.popRecentInputs();
		var player1 = new Fighter({
			x: -200,
			facing: 1,
			inputState: fighterInputs.getState()
		});
		this.player = player1;
		this.entities = [ player1 ];
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
			this.entities[i].move(t);
		}

		//check for hits
		//TODO
	};
	Game.prototype.render = function() {
		draw.rect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT, { fill: '#000', fixed: true });
		for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	};
	return Game;
});