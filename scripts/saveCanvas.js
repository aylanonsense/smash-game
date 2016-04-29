var fs = require('fs');
var path = require('path');
var Canvas = require('canvas');

module.exports = function saveCanvas(canvas, filePath, callback) {
	var out = fs.createWriteStream(path.join(__dirname, '../', filePath));
	var stream;
	if(filePath.endsWith('.png')) {
		stream = canvas.pngStream();
	}
	else if(filePath.endsWith('.jpeg')) {
		stream = canvas.jpegStream();
	}
	stream.on('data', function(chunk) {
		out.write(chunk);
	});
	stream.on('end', function() {
		if(callback) {
			callback();
		}
	});
};