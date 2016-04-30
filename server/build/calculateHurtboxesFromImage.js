define([
	'canvas',
	'image/loadImage',
	'build/calculateRectsFromPixels'
], function(
	Canvas,
	loadImage,
	calculateRectsFromPixels
) {
	return function calculateHurtboxesFromImage(imagePath, frameWidth, frameHeight, callback) {
		loadImage(imagePath, function(img) {
			var hurtboxes = [];

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
					var hurtboxData = {};
					//iterate through the cell's pixel data and gather meaningful hurtbox data
					for(var x = 0; x < frameWidth; x++) {
						hurtboxData[x] = {};
						for(var y = 0; y < frameHeight; y++) {
							var i = 4 * img.width * (row * frameHeight + y) + 4 * (col * frameWidth + x);
							var r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
							//blue means hurtboxes
							if(b > 0) {
								hurtboxData[x][y] = b;
							}
						}
					}
					//turn that into rectangles
					hurtboxes[numCols * row + col] = calculateRectsFromPixels(hurtboxData, frameWidth, frameHeight);
				}
			}

			//return the hurtbox data for each frame
			if(callback) {
				callback(hurtboxes);
			}
		});
	};
});