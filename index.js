/**
 * Prakhar Sahay 01/16/2017
 *
 * Main application server script.
 */

var express = require('express');
var app = express();
var Mongo = require('./MongoHelper');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index', {scheduleId: "prakhar"});
});

app.get('/admin', function(req, res) {
	res.render('pages/admin');// should require username and password
});

app.get('/schedule', function (req, res) {
	Mongo.data({})
	.then(Mongo.connect('blox'))
	.then(Mongo.dump('BloxSchedule'))
	.then(Mongo.send(res));
});

app.get('/schedule/:scheduleId', function (req, res) {
	Mongo.data({name: req.params.scheduleId})
	.then(Mongo.connect('blox'))
	.then(Mongo.find('BloxSchedule'))
	.then(Mongo.send(res));
});

app.post('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.insert('BloxSchedule'))
	.then(Mongo.send(res));
});

app.put('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.update('BloxSchedule'))
	.then(Mongo.send(res));
});

app.delete('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.delete('BloxSchedule'))
	.then(Mongo.send(res));
});

// TODO: match GET requests with a view-only page
app.get('/:scheduleId', function(req, res) {
	var scheduleId = req.params.scheduleId;
	res.render('pages/', {scheduleId: scheduleId});
});

// for the server console
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


