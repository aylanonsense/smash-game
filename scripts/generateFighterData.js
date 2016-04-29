var fs = require('fs');
var path = require('path');
var generateHitboxes = require('./generateHitboxes');
var fighterData = require('../data/fighters');

function generateDataForFighter(id, callback) {
	var spriteData = fighterData[id].sprite;
	generateHitboxes(fighterData[id].hitboxData, spriteData.frameWidth, spriteData.frameHeight, function(hitboxData) {
		var i, j;

		//transform hitbox data to be implanted into the frame data
		var hurtboxes = [];
		for(i = 0; i < hitboxData.length; i++) {
			hurtboxes[i] = [];
			for(j = 0; j < hitboxData[i].hurtboxes.length; j++) {
				hurtboxes[i][j] = [
					(hitboxData[i].hurtboxes[j].x - spriteData.center.x) * spriteData.scale,
					(hitboxData[i].hurtboxes[j].y - spriteData.center.y) * spriteData.scale,
					hitboxData[i].hurtboxes[j].width * spriteData.scale,
					hitboxData[i].hurtboxes[j].height * spriteData.scale
				];
			}
		}

		//put the hitbox data into the frame data
		var frameData = require(path.join(__dirname, '/..', fighterData[id].frameData));
		for(var state in frameData.states) {
			for(i = 0; i < frameData.states[state].animation.length; i++) {
				var frame = frameData.states[state].animation[i].spriteFrame;
				frameData.states[state].animation[i].hurtboxes = hurtboxes[frame];
			}
		}

		//save the compiled frame data
		fs.writeFile(path.join(__dirname, '/..', '/javascripts/data/generated/frameData.json'), JSON.stringify(frameData), function(err) {
			if(err) { throw err; }

			if(callback) {
				callback();
			}
		}); 
	});
}

module.exports = function generateFighterData(callback) {
	var id, numFighters = 0, numFightersGenerated = 0;
	for(id in fighterData) {
		numFighters++;
	}
	for(id in fighterData) {
		generateDataForFighter(id, checkForFinished);
	}
	function checkForFinished() {
		numFightersGenerated++;
		if(numFightersGenerated === numFighters && callback) {
			callback();
		}
	}
};