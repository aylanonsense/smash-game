define([
	'util/writeFile'
], function(
	writeFile
) {
	return function setUpApi(app) {
		app.post('/api/fighters', function(req, res) {
			var fighters = req.body;
			writeFile('/data/fighters.json', fighters, function(data) {
				res.writeHeader(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();
			});
		});
		app.post('/api/sprite-hurtboxes', function(req, res) {
			var spriteHurtboxes = req.body;
			writeFile('/data/sprite-hurtboxes.json', spriteHurtboxes, function(data) {
				res.writeHeader(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();
			});
		});
	};
});