const socketIo = require("socket.io");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const http = require("http");
const SyncController = require("./sync/syncController");
const roomManager = require("./game/roomManager");
const Room = require("./game/room");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../public"));

const server = http.Server(app);
const syncController = new SyncController(socketIo(server));

roomManager.addRoom(new Room(syncController));

require("./routes/level.routers")(app);
require("./routes/player.routers")(app);

module.exports = server;
