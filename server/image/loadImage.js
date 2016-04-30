define([
	'fs',
	'path',
	'module',
	'canvas'
], function(
	fs,
	path,
	module,
	Canvas
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	return function loadImage(filePath, callback) {
		fs.readFile(path.join(baseDir, filePath), function(err, imageData) {
			if(err) {
				throw err;
			}
			else if(callback) {
				var img = new Canvas.Image();
				img.src = imageData;
				callback(img);
			}
		});
	};
});