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

// app.get('/branch/:parentId', function(req, res) {
// 	var parentId = req.params.parentId;
// 	res.render('pages/branch', {parentId: parentId});
// });

// app.get('/branch', function(req, res) {
// 	res.render('pages/branch', {parentId: 'root'});
// });

// app.get('/leaf/:issueId', function(req, res) {
// 	var issueId = req.params.issueId;
// 	res.render('pages/leaf', {issueId: issueId});
// });

// app.get('/leaf', function(req, res) {
// 	res.render('pages/leaf', {issueId: 'root'});
// });

// app.get('/db', function (req, res) {
// 	Mongo.find('new', function (docs) {
// 		res.render('pages/db', {docs: docs});
// 	});
// });

// app.put('/db', function (req, res) {
// 	var dbInsert = function (data) {
// 		Mongo.insert('new', data, function (success) {
// 			res.send(success);
// 		});
// 	};

// 	// read in PUT body
// 	read(req, dbInsert);
// });

// app.delete('/db', function (req, res) {
// 	var dbDelete = function (data) {
// 		Mongo.delete('new', data, function (success) {
// 			res.send(success)
// 		});
// 	}

// 	// read in DELETE body
// 	read(req, dbDelete);
// });

// function read(req, terminate) {
// 	var body = [];
// 	req.on("data", function (chunk) {
// 		body.push(chunk);
// 	}).on("end", function () {
// 		body = Buffer.concat(body).toString();
// 		var data = querystring.parse(body);
// 		terminate(data);
// 	});
// }

// for the server console
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});