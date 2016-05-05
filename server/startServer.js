define([
	'express',
	'body-parser',
	'module',
	'path',
	'editor/setUpApi'
], function(
	express,
	bodyParser,
	module,
	path,
	setUpApi
) {
	var baseDir = path.join(path.dirname(module.uri), '/..');

	return function startServer() {
		//create a server
		var app = express();
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());

		//serve web stuff
		app.use(express.static(path.join(baseDir, '/web')));
		app.use(express.static(path.join(baseDir, '/client')));
		app.use('/sprites', express.static(path.join(baseDir, '/sprites')));
		app.use('/data', express.static(path.join(baseDir, '/data')));
		app.get('/require.js', function(req, res) {
			res.sendFile(path.join(baseDir, '/node_modules/requirejs-plugins/lib/require.js'));
		});
		app.get('/jquery.js', function(req, res) {
			res.sendFile(path.join(baseDir, '/node_modules/jquery/dist/jquery.js'));
		});
		app.get('/require/plugin/text.js', function(req, res) {
			res.sendFile(path.join(baseDir, '/node_modules/requirejs-plugins/lib/text.js'));
		});
		app.use('/require/plugin', express.static(baseDir + '/node_modules/requirejs-plugins/src'));

		//set up the api
		setUpApi(app);

		//start server
		app.listen(process.env.PORT || 3000);
		return app;
	};
});