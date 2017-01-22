/**
 * Prakhar Sahay 01/16/2017
 *
 * Main application server script.
 */

var express = require('express');
var app = express();
// var querystring = require('querystring');
// var Mongo = require('./MongoHelper');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index', {scheduleId: "prakhar"});
});

app.get('/admin', function(req, res) {
	res.render('pages/admin');// should send username and password
});

// db lookup should happen for below page loads, for now page will access localStorage

app.get('/:scheduleId', function(req, res) {
	var scheduleId = req.params.scheduleId;
	res.render('pages/', {scheduleId: scheduleId});
});

// for the server console
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});