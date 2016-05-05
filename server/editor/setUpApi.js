define([
	'express',
	'module',
	'path',
	'fs'
], function(
	express,
	module,
	path,
	fs
) {
	var baseDir = path.join(path.dirname(module.uri), '/../..');

	return function setUpApi(app) {
		app.post('/api/sprite-hurtboxes', function(req, res) {
			var spriteHurtboxes = req.body;
			fs.writeFile(path.join(baseDir, '/data/sprite-hurtboxes.json'), JSON.stringify(spriteHurtboxes), function(err) {
				if(err) { throw err; }
				res.writeHeader(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(spriteHurtboxes));
				res.end();
			});
		});
	};
});