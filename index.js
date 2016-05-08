//configure requirejs
var path = require('path');
var requirejs = require('requirejs');
requirejs.config({
	nodeRequire: require,
	baseUrl: path.join(__dirname, '/server'),
	paths: {
		data: '../data',
		//requirejs plugins for loading different file types
		json: '../node_modules/requirejs-plugins/src/json',
		text: '../node_modules/requirejs-plugins/lib/text'
	}
});
require = requirejs;

//run /server/main.js
requirejs('main')();