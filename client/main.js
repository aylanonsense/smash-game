define([
	'json!data/config.json',
	'Game'
], function(
	config,
	Game
) {
	return function main() {
		//set up the canvas
		if(config.RENDER) {
			canvas.setAttribute('width', config.CANVAS_WIDTH);
			canvas.setAttribute('height', config.CANVAS_HEIGHT);
		}

		//create the game
		var game = new Game();

		//kick off the game loop
		function loop() {
			game.update();
			game.render();
			scheduleLoop();
		}
		function scheduleLoop() {
			if(!config.FRAMES_PER_SECOND) {
				requestAnimationFrame(loop);
			}
			else {
				setTimeout(loop, 1000 / config.FRAMES_PER_SECOND);
			}
		}
		scheduleLoop();
	};
});