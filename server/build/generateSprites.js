define([
	'fs',
	'path',
	'module',
	'build/generateFighterSprites',
	'build/generateNonFighterSprites'
], function(
	fs,
	path,
	module,
	generateFighterSprites,
	generateNonFighterSprites
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	return function generateSprites(callback) {
		generateFighterSprites(function(fighterSpriteData) {
			generateNonFighterSprites(function(spriteData) {
				//combine the data
				for(var key in fighterSpriteData) {
					spriteData[key] = fighterSpriteData[key];
				}

				//save the compiled sprite data
				fs.writeFile(path.join(baseDir, '/client/data/generated/sprites.json'), JSON.stringify(spriteData), function(err) {
					if(err) { throw err; }

					if(callback) {
						callback();
					}
				});
			});
		});
	};
});