define([
	'module',
	'path',
	'fs'
], function(
	module,
	path,
	fs
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	return function writeFile(filePath, data, callback, ctx) {
		fs.writeFile(path.join(baseDir, filePath), JSON.stringify(data), function(err) {
			if(err) { throw err; }
			if(callback) {
				callback.call(ctx, data);
			}
		});
	};
});