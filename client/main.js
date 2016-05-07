define([
	'json!data/config.json',
	'editor/editor',
	'display/canvas',
	'Game',
	'level/Platform'
], function(
	config,
	editor,
	canvas,
	Game,
	Platform
) {
	return function main() {
		//run the editor
		editor.open();
		editor.on('play-game', function(playerFighterKey, npcFighterKey) {
			editor.close();

			//set up the canvas
			if(config.RENDER) {
				canvas.setAttribute('width', config.CANVAS_WIDTH);
				canvas.setAttribute('height', config.CANVAS_HEIGHT);
			}

			//create the game
			var game = new Game();
			game.loadLevel([
				new Platform({ x: -625, y: 50, width: 225, height: 700 }),
				new Platform({ x: -400, y: 0, width: 625, height: 750 }),
				new Platform({ x: 225, y: 125, width: 350, height: 625 }),
				new Platform({ x: 425, y: -150, width: 100, height: 175 }),
				new Platform({ x: -50, y: -125, width: 125, height: 25 }),
				new Platform({ x: 50, y: -250, width: 125, height: 25 }),
				new Platform({ x: -50, y: -375, width: 125, height: 22.5 })
			]);

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
		});
	};
});