const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("../config/db");
const Matter = require("matter-js");
const GameFactory = require("./game/gameFactory");
const GameObject = require("../public/js/shared/game/gameObject");
const gameObjectTypes = require("../public/js/shared/game/gameObjectTypes");
const Physics = require("./physics/physics");
const id = require("./util/id");
const SyncController = require("./sync/syncController");

const app = express();
app.use(express.static(__dirname + "/../public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const server = http.Server(app);
const syncController = new SyncController(socketIo(server));
const physics = new Physics(Matter);

const wall = physics
	.getMatter()
	.Bodies.rectangle(0, 580, 800, 20, { isStatic: true });
const player = physics.getMatter().Bodies.rectangle(50, 0, 30, 30);
physics.getMatter().World.addBody(physics.getEngine().world, wall);
physics.getMatter().World.addBody(physics.getEngine().world, player);

const game = new GameFactory()
	.withSyncController(syncController)
	.withMilisPerTick(1000 / 40)
	.withPhysics(physics)
	.withGameObjects([
		new GameObject(0 /*id.next()*/, gameObjectTypes.PLAYER, player),
		new GameObject(1 /*id.next()*/, gameObjectTypes.STATIC_OBSTICAL, wall),
	])
	.create();

game.start();

module.exports = server;
