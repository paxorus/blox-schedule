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
 * Reads a MongoDB Cursor into an array.
 *
 * @private
 */
exports._collect = function (mongo, then) {
	var docs = [];
	mongo.cursor.each(function(err, doc) {
		if (err) {
			throw err;
		}
		if (doc != null) {
			docs.push(doc);
		} else {
			mongo.db.close();
			then({result: docs});
		}
	});
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
};

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
};

/**
 * Sends the transaction result via the specified Response object.
 *
 * @return a terminal action
 */
exports.send = function (res) {
	return function (mongo) {
		res.send(mongo.result);
	};
};

/**
 * Sends a {name, message} error via the specified Response object.
 *
 * @return a terminal action
 */
exports.error = function (res) {
	return function (reason) {
		res.status(400).send({
			name: reason.name,
			message: reason.message
		});
	};
};

/**
 * @return a terminal action
 */
exports.render = function (res, page) {
	return function (mongo) {
		res.render(page, {
			scheduleName: mongo.data.name,
			scheduleData: mongo.result.schedule.replace(/\n/g, "\\n")
		});
	};
};

/**
 *
 *
 * @return a terminal action
 */
exports.missing = function (res, page) {
	return function (mongo) {
		// parse the error message for the requested schedule name
		var scheduleName = mongo.message.substring("No schedule ".length);
		res.render(page, {
			scheduleName: scheduleName
		});
	};
};

/**
 * Asynchronously establishes a connection with mLab, must come before any db transaction.
 */
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


/**
 * Returns all schedule name, suitable for GET requests.
 */
exports.dump = function (collection) {
	return function (mongo) {
		return new Promise(function (resolve) {
			mongo.cursor = mongo.db.collection(collection).find({}, {name: 1, _id: 0});
			exports._collect(mongo, resolve);
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

		return new Promise(function (resolve, reject) {
			mongo.db.collection(collection).findOne(obj, {schedule: 1, name: 1, _id: 0}, function (err, result) {
				if (err) {
					reject(err);
				}

				if (result === null) {
					reject({
						name: "MongoError",
						message: "No schedule " + obj.name
					});
				}
				mongo.db.close();
				mongo.result = result;
				resolve(mongo);
			});
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

		return new Promise(function (resolve, reject) {
			mongo.db.collection(collection).insertOne(obj, function (err, result) {
				if (err) {
					reject(err);
				}
				mongo.db.close();
				mongo.result = {message: "Created " + obj.name};
				resolve(mongo);
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

/**
 * Deletes a schedule by name, suitable for DELETE requests.
 */
exports.delete = function (collection) {
	return function (mongo) {
		var selector = {
			name: mongo.data.name
		};

		return new Promise(function (resolve, reject) {
			mongo.db.collection(collection).deleteOne(selector, function (err, result) {
				if (err) {
					reject(err);
				}
				if (result.deletedCount === 0) {
					reject({
						name: "MongoError",
						message: "No schedule " + selector.name + "."
					});
				}
				mongo.db.close();
				mongo.result = {message: "Deleted " + selector.name};
				resolve(mongo);
			});
		});
	};
};
