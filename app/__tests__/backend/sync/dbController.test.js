const DbController = require("../../../backend/sync/dbController");
const connectDB = require("../../../config/db");
const mongooseMock = require("mongoose");

jest.mock("../../../config/db");
jest.mock("mongoose");

beforeEach(() => {
	connectDB.mockClear();
});

describe("Test the DbController class", () => {
	test("if connectDB method is called in constructor.", () => {
		let dbController = new DbController();

		expect(connectDB).toHaveBeenCalled();
	});

	test("if _createModel calls the right methods", () => {
		let dbController = new DbController();

		let model = dbController._createModel("players", {
			id: String,
			type: String,
		});

		expect(mongooseMock.Schema).toHaveBeenCalled();
		expect(mongooseMock.model).toHaveBeenCalled();
	});

	test("if wrapGameObject calls the right method", () => {
		let gameObject = {
			id: 1,
			type: "player",
		};
		let dbController = new DbController();
		jest.spyOn(dbController, "_createModel");

		let model = dbController.wrapGameObject(gameObject);

		expect(dbController._createModel).toHaveBeenCalled();
	});

	test("if saveDocument calls the right method", () => {
		let document = {
			save: function () {},
		};

		jest.spyOn(document, "save");
		let dbController = new DbController();
		dbController.saveDocument(document);

		expect(document.save).toHaveBeenCalled();
	});

	test("if findDocument calls the right method", () => {
		let model = {
			find: function () {},
		};
		let searchString = "test";

		jest.spyOn(model, "find");
		let dbController = new DbController();
		dbController.findDocument(searchString, model);

		expect(model.find).toHaveBeenCalled();
	});
});
