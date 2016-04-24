define([
	'config',
	'display/canvas',
	'Game',
	'util/now'
], function(
	config,
	canvas,
	Game,
	now
) {
	return function() {
		//set up the canvas
		if(config.RENDER) {
			canvas.setAttribute("width", config.CANVAS_WIDTH);
			canvas.setAttribute("height", config.CANVAS_HEIGHT);
		}

		//create the game
		var game = new Game();

		//kick off the game loop
		var prevTime = now();
		function loop() {
			var time = now();
			var framesPerSecond = config.FRAMES_PER_SECOND === null ? 60 : config.FRAMES_PER_SECOND;
			var t = config.TIME_SCALE * Math.min(3 / framesPerSecond, (time - prevTime) / 1000);
			if(config.CONSTANT_TIME_PER_FRAME) {
				t = config.TIME_SCALE / framesPerSecond;
			}
			game.update(t);
			game.render();
			prevTime = time;
			scheduleLoop();
		}
		function scheduleLoop() {
			if(config.FRAMES_PER_SECOND === null) {
				requestAnimationFrame(loop);
			}
			else {
				setTimeout(loop, 1000 / config.FRAMES_PER_SECOND);
			}
		}
		scheduleLoop();
	};
});