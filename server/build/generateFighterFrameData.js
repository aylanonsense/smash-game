define([
	'fs',
	'path',
	'module',
	'build/calculateHurtboxesFromImage',
	'json!data/fighters.json'
], function(
	fs,
	path,
	module,
	calculateHurtboxesFromImage,
	fighters
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	function generateFrameDataForFighter(id, callback) {
		//get the raw frame data for the fighter
		require([ 'json!' + fighters[id].frameDataFilePath.substring(1) ], function(frameData) {
			//calculate the frame totals for each animation
			for(var state in frameData.states) {
				frameData.states[state].totalFrames = 0;
				for(var i = 0; i < frameData.states[state].animation.length; i++) {
					frameData.states[state].totalFrames += frameData.states[state].animation[i].frames;
				}
			}
			//get hurtbox data
			calculateHurtboxesFromImage(fighters[id].hurtboxImagePath, fighters[id].sprite.frameWidth, fighters[id].sprite.frameHeight, function(hurtboxData) {
				var i, j;

				//insert the hurtbox data into the frame data
				frameData.hurtboxes = [];
				for(i = 0; i < hurtboxData.length; i++) {
					frameData.hurtboxes[i] = [];
					for(j = 0; j < hurtboxData[i].length; j++) {
						frameData.hurtboxes[i].push([
							(hurtboxData[i][j].x - fighters[id].sprite.center.x) * fighters[id].sprite.scale,
							(hurtboxData[i][j].y - fighters[id].sprite.center.y) * fighters[id].sprite.scale,
							hurtboxData[i][j].width * fighters[id].sprite.scale,
							hurtboxData[i][j].height * fighters[id].sprite.scale
						]);
					}
				}

				//save the compiled frame data
				fs.writeFile(path.join(baseDir, '/client/data/generated/' + id + 'FrameData.json'), JSON.stringify(frameData), function(err) {
					if(err) { throw err; }

					if(callback) {
						callback();
					}
				});
			});
		});
	}

	return function generateFighterFrameData(callback) {
		//just generate the frame data for each fighter and call the callback when they're all done!
		var id, numFighters = 0, numFightersGenerated = 0;
		for(id in fighters) {
			numFighters++;
		}
		for(id in fighters) {
			generateFrameDataForFighter(id, checkForFinished);
		}
		function checkForFinished() {
			numFightersGenerated++;
			if(numFightersGenerated === numFighters && callback) {
				callback();
			}
		}
	};
});