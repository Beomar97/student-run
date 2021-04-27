module.exports = (app) => {
	const level = require("../controllers/level.controller.js");
	const router = require("express").Router();

	router.get("/:id", level.getById);

	router.get("/", level.getAll);

	app.use("/levels", router);
};
