var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

module.exports = function loadImage(filePath, callback) {
	fs.readFile(path.join(__dirname, '../', filePath), function(err, imageData) {
		if(err) {
			throw err;
		}
		else {
			var img = new Canvas.Image();
			img.src = imageData;
			callback(img);
		}
	});
};