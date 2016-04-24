var path = require('path');
var express = require('express');

//set up a server
var app = express();

//serve web stuff
app.use(express.static(path.join(__dirname, '/web')));
app.use('/sprites', express.static(path.join(__dirname, '/sprites')));
app.use('/javascripts', express.static(path.join(__dirname, '/javascripts')));
app.get('/lib/require.js', function(req, res) {
	res.sendFile(path.join(__dirname, '/node_modules/requirejs/require.js'));
});

//run server
app.listen(process.env.PORT || 3000);