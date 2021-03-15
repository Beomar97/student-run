const express = require("express");
const http = require("http");
const connectDB = require("../config/db");
const events = require("../public/js/shared/sync/events");
const SyncController = require("./sync/syncController");

const app = express();
app.use(express.static(__dirname + "/../public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
const server = http.Server(app);

const syncController = new SyncController(server);
syncController.control((serverSync) => {
	console.log("Connection " + serverSync.getId());
	serverSync.on(events.MESSAGE, (message) => {
		console.log(message);
		serverSync.emit(events.MESSAGE, "Hallo client");
	});
});

module.exports = server;
