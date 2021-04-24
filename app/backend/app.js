const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const Matter = require("matter-js");
const GameFactory = require("./game/gameFactory");
const { Player } = require("../public/js/shared/game/gameObject");
const gameObjectTypes = require("../public/js/shared/game/gameObjectTypes");
const Physics = require("./physics/physics");
const id = require("./util/id");
const SyncController = require("./sync/syncController");

const physics = new Physics(Matter);
const LevelLoader = require("./game/levelLoader");
const levelLoader = new LevelLoader("../../public/js/shared/levels/", physics);

// Express
const app = express();
app.use(morgan("dev"));
app.use(express.static(__dirname + "/../public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
app.get("/levels", (req, res) => {
	return res.send(Object.values(levelLoader.levelCollection));
});
app.get("/levels/:levelId", (req, res) => {
	return res.send(levelLoader.getLevelJSONById(req.params.levelId));
});

const server = http.Server(app);
const syncController = new SyncController(socketIo(server));

let gameObjectCollection = [];

// Init player
const player = physics.getMatter().Bodies.circle(300, 300, 25, {
	frictionAir: 0.3,
});
gameObjectCollection.push(
	new Player(id.next(), gameObjectTypes.PLAYER, player, 0.005)
);

// Load level with objects
const levelObjects = levelLoader.getLevelObjectsById(0);
gameObjectCollection = gameObjectCollection.concat(levelObjects);

gameObjectCollection.forEach((gameObject) => {
	physics
		.getMatter()
		.World.addBody(physics.getEngine().world, gameObject.innerObject);
});

// Create game
const game = new GameFactory()
	.withSyncController(syncController)
	.withMilisPerTic(1000 / 40)
	.withTicsPerPublish(4)
	.withMaxSnapshots(10)
	.withTicsPerSnapshot(8)
	.withMaxEntriesEventQueue(80)
	.withAllowedEventMaxAge(70)
	.withPhysics(physics)
	.withGameObjects(gameObjectCollection)
	.withFinishLineOffset(50)
	.create();
game.start();

module.exports = server;
