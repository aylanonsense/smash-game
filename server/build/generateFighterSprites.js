define([
	'image/createSprite',
	'json!data/fighters.json'
], function(
	createSprite,
	fighters
) {
	function generateSpriteForFighter(id, callback) {
		//generate the sprite using the params in /server/data/fighters.json
		var spriteKey = 'fighter-' + id;
		var generatedSpritePath = '/sprites/generated/' + spriteKey + '.png';
		var spriteParams = {
			generateFlippedFrames: true,
			frameWidth: fighters[id].sprite.frameWidth,
			frameHeight: fighters[id].sprite.frameHeight,
			scale: fighters[id].sprite.scale
		};
		createSprite(generatedSpritePath, fighters[id].sprite.imagePath, spriteParams, function(numCols, numRows) {
			//get the raw frame data for the fighter so we can record the sprite key
			require([ 'json!' + fighters[id].frameDataFilePath.substring(1) ], function(frameData) {
				frameData.spriteKey = spriteKey;

				//return the sprite data that was generated
				callback(spriteKey, {
					imagePath: generatedSpritePath,
					frameWidth: fighters[id].sprite.frameWidth * fighters[id].sprite.scale,
					frameHeight: fighters[id].sprite.frameHeight * fighters[id].sprite.scale,
					numCols: numCols,
					numRows: numRows,
					center: {
						x: fighters[id].sprite.center.x * fighters[id].sprite.scale,
						y: fighters[id].sprite.center.y * fighters[id].sprite.scale
					}
				});
			});
		});
	}

	return function generateFighterSprites(callback) {
		//just generate the sprite for each fighter and call the callback when they're all done!
		var id, generatedSpriteData = {}, numFighters = 0, numSpritesGenerated = 0;
		for(id in fighters) {
			numFighters++;
		}
		for(id in fighters) {
			generateSpriteForFighter(id, checkForFinished);
		}
		function checkForFinished(spriteKey, spriteParams) {
			generatedSpriteData[spriteKey] = spriteParams;
			numSpritesGenerated++;
			if(numSpritesGenerated === numFighters && callback) {
				callback(generatedSpriteData);
			}
		}
	};
});