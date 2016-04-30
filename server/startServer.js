define([
	'express',
	'module',
	'path'
], function(
	express,
	module,
	path
) {
	var baseDir = path.join(path.dirname(module.uri), '/..');

	return function startServer() {
		//create a server
		var app = express();

		//serve web stuff
		app.use(express.static(path.join(baseDir, '/web')));
		app.use(express.static(path.join(baseDir, '/client')));
		app.use('/sprites', express.static(path.join(baseDir, '/sprites')));
		app.get('/require.js', function(req, res) {
			res.sendFile(path.join(baseDir, '/node_modules/requirejs-plugins/lib/require.js'));
		});
		app.get('/require/plugin/text.js', function(req, res) {
			res.sendFile(path.join(baseDir, '/node_modules/requirejs-plugins/lib/text.js'));
		});
		app.use('/require/plugin', express.static(baseDir + '/node_modules/requirejs-plugins/src'));

		//start server
		app.listen(process.env.PORT || 3000);
	};
});