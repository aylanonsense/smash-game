define([
	'image/createSprite',
	'json!data/extra-sprites.json'
], function(
	createSprite,
	sprites
) {
	function generateSprite(spriteKey, callback) {
		//generate the sprite using the params in /server/data/sprites.json
		var generatedSpritePath = '/sprites/generated/' + spriteKey + '.png';
		var spriteParams = {
			generateFlippedFrames: sprites[spriteKey].generateFlippedFrames,
			frameWidth: sprites[spriteKey].frameWidth,
			frameHeight: sprites[spriteKey].frameHeight,
			scale: sprites[spriteKey].scale
		};
		createSprite(generatedSpritePath, sprites[spriteKey].imagePath, spriteParams, function(numCols, numRows) {
			callback(spriteKey, {
				imagePath: generatedSpritePath,
				frameWidth: sprites[spriteKey].frameWidth * sprites[spriteKey].scale,
				frameHeight: sprites[spriteKey].frameHeight * sprites[spriteKey].scale,
				numCols: numCols,
				numRows: numRows,
				center: {
					x: sprites[spriteKey].center.x * sprites[spriteKey].scale,
					y: sprites[spriteKey].center.y * sprites[spriteKey].scale
				}
			});
		});
	}

	return function generateNonFighterSprites(callback) {
		//just generate each sprite
		var spriteKey, generatedSpriteData = {}, numSpritesToGenerate = 0, numSpritesGenerated = 0;
		for(spriteKey in sprites) {
			numSpritesToGenerate++;
		}
		for(spriteKey in sprites) {
			generateSprite(spriteKey, checkForFinished);
		}
		function checkForFinished(spriteKey, spriteParams) {
			generatedSpriteData[spriteKey] = spriteParams;
			numSpritesGenerated++;
			if(numSpritesGenerated === numSpritesToGenerate && callback) {
				callback(generatedSpriteData);
			}
		}
	};
});