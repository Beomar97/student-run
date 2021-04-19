const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const logger = require("../logger");

class DbController {
	constructor() {
		connectDB();
	}

	wrapGameObject(gameObject) {
		const gameObjectModel = this._createModel(gameObject.type, {
			id: String,
			type: String,
		});

		return gameObjectModel;
	}

	_createModel(name, schema) {
		const mongooseSchema = new mongoose.Schema(schema);
		const model = mongoose.model(name, mongooseSchema);

		return model;
	}

	createDocument(gameObject, model) {
		const document = new model({
			id: gameObject.id,
			type: gameObject.type,
		});
		return document;
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
