define([
	'canvas',
	'image/loadImage',
	'build/calculateRectsFromPixelData'
], function(
	Canvas,
	loadImage,
	calculateRectsFromPixelData
) {
	return function calculateRectsFromImage(imagePath, frameWidth, frameHeight, callback) {
		loadImage(imagePath, function(img) {
			var rects = [];

			//get image data
			var canvas = new Canvas(img.width, img.height);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var data = ctx.getImageData(0, 0, img.width, img.height).data;

			//iterate through every cell of the sprite
			var numCols = Math.floor(img.width / frameWidth);
			var numRows = Math.floor(img.height / frameHeight);
			for(var row = 0; row < numRows; row++) {
				for(var col = 0; col < numCols; col++) {
					var pixelData = {};
					//iterate through the cell's pixel data and gather meaningful hurtbox data
					for(var x = 0; x < frameWidth; x++) {
						pixelData[x] = {};
						for(var y = 0; y < frameHeight; y++) {
							var i = 4 * img.width * (row * frameHeight + y) + 4 * (col * frameWidth + x);
							var r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
							//color means rects
							if(r + g + b > 0) {
								pixelData[x][y] = r + g + b;
							}
						}
					}
					//turn that into rectangles
					rects[numCols * row + col] = calculateRectsFromPixelData(pixelData, frameWidth, frameHeight);
				}
			}

			//return the hurtbox data for each frame
			if(callback) {
				callback(rects);
			}
		});
	};
});