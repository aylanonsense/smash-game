define([
	//'build/generateSprites',
	//'build/generateFighterFrameData',
	'startServer'
], function(
	//generateSprites,
	//generateFighterFrameData,
	startServer
) {
	return function main() {
		//console.log('Generating sprites');
		//generateSprites(function() {
			//console.log('Generating fighter frame data');
			//generateFighterFrameData(function() {
				console.log('Starting server');
				startServer();
			//});
		//});
	};
});