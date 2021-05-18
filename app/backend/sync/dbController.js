const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const logger = require("../logger");

class DbController {
	constructor() {
		connectDB();
	}

	wrapGameObject(gameObject) {
		return this._createModel(gameObject.type, {
			id: String,
			type: String,
		});
	}

	_createModel(name, schema) {
		const mongooseSchema = new mongoose.Schema(schema);

		return mongoose.model(name, mongooseSchema);
	}

	createDocument(gameObject, model) {
		return new model({
			id: gameObject.id,
			type: gameObject.type,
		});
	}

	saveDocument(document) {
		logger.log({
			level: "info",
			message: "Start saving to DB",
		});
		document.save();
		logger.log({
			level: "info",
			message: "Finished saving to DB",
		});
	}

	findDocument(searchString, model) {
		model.find({ id: searchString }, function (err, object) {
			if (err) return console.error(err);
			console.log(object);
		});
	}
}

module.exports = DbController;
