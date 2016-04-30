define([
	'canvas',
	'image/loadImage',
	'image/saveCanvas'
], function(
	Canvas,
	loadImage,
	saveCanvas
) {
	return function createSprite(destinationImagePath, sourceImagePath, params, callback) {
		loadImage(sourceImagePath, function(img) {
			//get image data
			var canvas = new Canvas(img.width, img.height);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var data = ctx.getImageData(0, 0, img.width, img.height).data;

			//create canvas on which to draw the generated sprite
			canvas = new Canvas(img.width * params.scale, img.height * params.scale * (params.generateFlippedFrames ? 2 : 1));
			ctx = canvas.getContext('2d');

			//iterate through every cell of the sprite
			var numCols = Math.floor(img.width / params.frameWidth);
			var numRows = Math.floor(img.height / params.frameHeight);
			for(var row = 0; row < numRows; row++) {
				for(var col = 0; col < numCols; col++) {
					//iterate through the cell's pixel data
					for(var x = 0; x < params.frameWidth; x++) {
						for(var y = 0; y < params.frameHeight; y++) {
							var i = 4 * img.width * (row * params.frameHeight + y) + 4 * (col * params.frameWidth + x);
							var r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
							//draw upscaled pixel
							ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
							ctx.fillRect((col * params.frameWidth + x) * params.scale, (row * params.frameHeight + y) * params.scale, params.scale, params.scale);
							//draw flipped upscaled pixel
							ctx.fillRect(((col + 1) * params.frameWidth - x - 1) * params.scale, ((row + numRows) * params.frameHeight + y) * params.scale, params.scale, params.scale);
						}
					}
				}
			}

			//save the generated sprite
			saveCanvas(canvas, destinationImagePath, function() {
				if(callback) {
					callback(numCols, numRows);
				}
			});
		});
	};
});