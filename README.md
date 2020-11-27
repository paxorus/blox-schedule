Blox Schedule
====

### What is this?
A basic Web app to manage and display my weekly schedule. Originally it was built on Parse.js, but after its shutdown in January 2017 I upgraded to Node.js and AWS. The `/admin` page provides basic CRUD utilities, allowing me to switch between and edit any schedule while also  and create and delete. Express.js dynamically routes to each schedule by name, making it easy to share public links. All this allows me to effectively and easily organize and share my activities.

### Deploys
The Web app is deployed [on Heroku](http://seismic-blox.herokuapp.com/). I've password-protected the admin panel for obvious reasons. You can still see what the page looks like, but only the dropdown will work.

The development version is on the dev branch. The deployed version is on the master branch and periodicially rebased to dev. A static version will be available for some time [on GitHub Pages](http://paxorus.github.io/blox/view.html) through the gh-pages branch, in case anyone still has the old link.


### JavaScript Snippets
My nifty MongoHelper node module is what motivates me to share the project. It provides a wonderful API for chaining asynchronous actions and is my take on extinguishing callback hell, thanks to ES6 Promises. You may have already picked up on the sleight of hand conjuring this one-line function, but if not, read on.
```javascript
var Mongo = require('MongoHelper');

// update a document by name
app.put('/schedule', function (req, res) {
	Mongo.read(req)
	.then(Mongo.connect('blox'))
	.then(Mongo.update('BloxSchedule'))
	.then(Mongo.send(res))
	.catch(Mongo.error(res));
});
```
#### AJAX
Saving from the admin panel sends an incredibly concise AJAX request, courtesy of jQuery.
```javascript
// Save
$("#save").click(function () {
	$.ajax({
		url: "/schedule",
		method: "PUT",
		success: Notifier.success,
		error: Notifier.error,
		data: {
			name: localStorage.currentSchedule,
			schedule: $("#text-input").val(),
			username: localStorage.username,
			password: localStorage.password
		}
	});
});
```

#### Connecting to the cloud
In MongoHelper.js, each action adds a little information to the `mongo` object, ensuring everything including the original `Request` object is available downstream.
```javascript
exports.connect = function (dbName) {
	return function (mongo) {
		return new Promise(function (resolve, reject) {
			var url = exports._url(dbName, mongo.data);
			MongoClient.connect(url, function (err, db) {
				if (err) {
					reject(err);
				}
				mongo.db = db;
				resolve(mongo);
			});
		});
	};
};
```

#### The actual operation
Having a clean API often comes at a small cost on the other side. If a document is successfully updated, the result is placed on the `mongo` object and passed forward, implicilty invoking `Mongo.send()`. If no document was updated, the `Mongo.error()` callback is implicitly invoked.
```javascript
exports.update = function (collection) {
	return function (mongo) {
		...
		return new Promise(function (resolve, reject) {
			mongo.db.collection(collection).updateOne(selector, data, function (err, result) {
				if (err) {
					reject(err);
				}
				if (result.matchedCount === 0) {
					reject({
						name: "MongoError",
						message: "No schedule " + selector.name
					});
				}
				mongo.db.close();
				mongo.result = {message: "Updated " + selector.name};
				resolve(mongo);
			});
		});
	};
};
```
#### Updating the UI
Finally on the front-end, the Notifier object issues either a success or an error notification to the user.
```javascript
var Notifier = {
	...,
	getNotification: function (message, classNames) {
		var notification = $("<div>", {class: classNames})
		notification.text(message);
		$("body").append(notification);
		notification.css("margin-left", -notification.innerWidth() / 2);
		notification.fadeOut(5000);		
	}
};
```
