define([
	'json!data/config.json',
	'build/generateSprites',
	'startServer',
	'util/writeFile'
], function(
	config,
	generateSprites,
	startServer,
	writeFile
) {
	function maybeGenerateSprites(callback) {
		if(config.GENERATE_SPRITES) {
			console.log('Generating sprites');
			generateSprites(function(sprites) {
				writeFile('/data/generated/sprites.json', sprites, callback);
			});
		}
		else {
			callback();
		}
	}

	return function main() {
		maybeGenerateSprites(function() {
			console.log('Starting server');
			startServer();
		});
	};
});