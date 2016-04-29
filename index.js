var path = require('path');
var express = require('express');
var generateFighterData = require('./scripts/generateFighterData');

//generate fighter data
console.log('Genearting fighter data');
generateFighterData(function() {
	console.log('Starting server');

	//set up a server
	var app = express();

	//serve web stuff
	app.use(express.static(path.join(__dirname, '/web')));
	app.use('/sprites', express.static(path.join(__dirname, '/sprites')));
	app.use('/javascripts', express.static(path.join(__dirname, '/javascripts')));
	app.get('/require.js', function(req, res) {
		res.sendFile(__dirname + '/node_modules/requirejs-plugins/lib/require.js');
	});
	app.get('/require/plugin/text.js', function(req, res) {
		res.sendFile(__dirname + '/node_modules/requirejs-plugins/lib/text.js');
	});
	app.use('/require/plugin', express.static(__dirname + '/node_modules/requirejs-plugins/src'));

	//run server
	app.listen(process.env.PORT || 3000);
});