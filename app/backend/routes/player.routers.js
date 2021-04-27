module.exports = (app) => {
	const player = require("../controllers/player.controller.js");
	const router = require("express").Router();

	router.get("/", player.getAll);

	app.use("/players", router);
};
