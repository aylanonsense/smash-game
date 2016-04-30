define([
	'fs',
	'path',
	'module'
], function(
	fs,
	path,
	module
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	return function saveCanvas(canvas, filePath, callback) {
		var out = fs.createWriteStream(path.join(baseDir, filePath));
		var stream = canvas.pngStream();
		stream.on('data', function(chunk) {
			out.write(chunk);
		});
		stream.on('end', function() {
			if(callback) {
				callback();
			}
		});
	};
});