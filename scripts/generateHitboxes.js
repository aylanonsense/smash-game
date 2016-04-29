var loadImage = require('./loadImage');
var saveCanvas = require('./saveCanvas');
var toRects = require('./toRects');
var Canvas = require('canvas');

module.exports = function generateHitboxes(imageFilePath, frameWidth, frameHeight, callback) {
	loadImage(imageFilePath, function(img) {
		var frameData = [];
		var canvas = new Canvas(img.width, img.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var data = ctx.getImageData(0, 0, img.width, img.height).data;
		var numCols = Math.floor(img.width / frameWidth);
		var numRows = Math.floor(img.height / frameHeight);
		for(var row = 0; row < numRows; row++) {
			for(var col = 0; col < numCols; col++) {
				var hurtboxData = {};
				//iterate through the cell's pixel data and extra meaningful hitbox data
				for(var x = 0; x < frameWidth; x++) {
					hurtboxData[x] = {};
					for(var y = 0; y < frameHeight; y++) {
						var i = 4 * img.width * (row * frameHeight + y) + 4 * (col * frameWidth + x);
						var r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
						if(b > 0) {
							hurtboxData[x][y] = true;
						}
					}
				}
				//turn that into useful rectangles
				frameData[numCols * row + col] = {
					hurtboxes: toRects(hurtboxData, frameWidth, frameHeight)
				};
			}
		}
		//return the hitbox data for each frame
		if(callback) {
			callback(frameData);
		}
	});
};