/**
 * Abstraction layer for MongoClient.
 * 
 * @author Prakhar Sahay 09/24/2016
 * @module MongoHelper
 */

var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var querystring = require('querystring');

var promise;

/**
 * @private
 */
exports._url = function (dbName, data) {
	var format = "mongodb://%s:%s@ds137149.mlab.com:37149/%s";
	return util.format(format, data.username, data.password, dbName);
};

/**
 * Collects data buffers from HTTP request stream.
 *
 * @return an initiator promise.
 */
exports.read = function (req) {
	return new Promise(function (resolve) { 
		var body = [];
		req.on("data", function (chunk) {
			body.push(chunk);
		}).on("end", function () {
			body = Buffer.concat(body).toString();
			var data = querystring.parse(body);
			resolve({data: data});
		});
	});
}

/**
 * Sends result via specified Response object.
 *
 * @return a terminal action
 */
exports.send = function (res) {
	return function (result) {
		res.send(result);
	};
}

/**
 * Packs provided object into a then-able.
 *
 * @return an initiator pseudo-promise
 */
exports.data = function (data) {
	data.username = "readonly";
	data.password = "readonly";
	return {
		then: function (resolve) {
			return resolve({data: data});
		}
	};
}


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
		}).catch(function (err) {
			console.log(79);
			console.log(err);
			console.log(81);
		});
	};
};

/**
 * Inserts a new Schedule document, suitable for POST requests.
 */
exports.insert = function (collection) {
	return function (mongo) {
		var obj = {
			name: mongo.data.name,
			schedule: mongo.data.schedule
		};

		return new Promise(function (resolve) {
			mongo.db.collection(collection).insertOne(obj, function (err, result) {
				if (err) {
					throw err;
				}
				mongo.db.close();
				resolve(result);
			});
		});
	};
};

/**
 * Finds a schedule by name and returns it, suitable for GET requests.
 */
exports.find = function (collection) {
	return function (mongo) {
		var obj = {
			name: mongo.data.name
		};

		return new Promise(function (resolve) {
			mongo.db.collection(collection).findOne(obj, {schedule: 1, name: 1, _id: 0}, function (err, result) {
				if (err) {
					throw err;
				}
				mongo.db.close();
				resolve(result);
			});
		});		
	};
};

/**
 * Finds a schedule by name and updates the schedule, suitable for PUT requests.
 */
exports.update = function (collection) {
	return function (mongo) {
		var selector = {
			name: mongo.data.name
		};
		var data = {
			$set: {schedule: mongo.data.schedule}
		};

		return new Promise(function (resolve) {
			mongo.db.collection(collection).updateOne(selector, data, function (err, result) {
				if (err) {
					throw err;
				}
				mongo.db.close();
				resolve(result);
			});
		});
	};
};

/**
 * Deletes a schedule by name, suitable for DELETE requests.
 */
exports.delete = function (collection) {
	return function (mongo) {
		var selector = {
			name: mongo.data.name
		};

		return new Promise(function (resolve) {
			mongo.db.collection(collection).deleteOne(selector, function (err, result) {
				if (err) {
					throw err;
				}
				mongo.db.close();
				resolve(result);
			});
		});
	};
};
