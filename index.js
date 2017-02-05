/**
 * Main application server script.
 *
 * @author Prakhar Sahay 01/16/2017
 */

var express = require('express');
var app = express();
var Mongo = require('./MongoHelper');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* PAGE ROUTES */
// default URL, defaults to index.ejs with "prakhar" schedule
app.get('/', function(req, res) {
	Mongo.data({name: "prakhar"})
	.then(Mongo.connect('blox'))
	.then(Mongo.find('BloxSchedule'))
	.then(Mongo.render(res, 'pages/'))
	.catch(Mongo.missing(res, 'pages/404.ejs'));
});

// admin.ejs
app.get('/admin', function(req, res) {
	res.render('pages/admin');// should require username and password
});

// retrieve all schedule names as JSON
app.get('/schedule', function (req, res) {
	Mongo.data({})
	.then(Mongo.connect('blox'))
	.then(Mongo.dump('BloxSchedule'))
	.then(Mongo.send(res));
});

// load index.ejs with requested schedule
app.get('/:scheduleName', function(req, res) {
	Mongo.data({name: req.params.scheduleName})
	.then(Mongo.connect('blox'))
	.then(Mongo.find('BloxSchedule'))
	.then(Mongo.render(res, 'pages/'))
	.catch(Mongo.missing(res, 'pages/404.ejs'));
});


/* APP ROUTES */
// retrieve a specific document
app.get('/schedule/:scheduleId', function (req, res) {
	Mongo.data({name: req.params.scheduleId})
	.then(Mongo.connect('blox'))
	.then(Mongo.find('BloxSchedule'))
	.then(Mongo.send(res))
	.catch(Mongo.error(res));
});

// password-protected, insert a new document
app.post('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.insert('BloxSchedule'))
	.then(Mongo.send(res))
	.catch(Mongo.error(res));
});

// password-protected, update a document by name
app.put('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.update('BloxSchedule'))
	.then(Mongo.send(res))
	.catch(Mongo.error(res));
});

// password-protected, delete a document by name
app.delete('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.delete('BloxSchedule'))
	.then(Mongo.send(res))
	.catch(Mongo.error(res));
});



// for the server console
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


