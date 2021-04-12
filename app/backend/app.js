const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const events = require("../public/js/shared/sync/events");
const Matter = require("matter-js");
const GameFactory = require("./game/gameFactory");
const GameObject = require("../public/js/shared/game/gameObject");
const gameObjectTypes = require("../public/js/shared/game/gameObjectTypes");
const gameObjectShapes = require("../public/js/shared/game/gameObjectShapes");
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
	new GameObject(id.next(), gameObjectTypes.PLAYER, player)
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
	.withMilisPerTick(1000 / 40)
	.withPhysics(physics)
	.withGameObjects(gameObjectCollection)
	.create();
game.start();

// Connect to db with
// connectDB()

// new schema to save sth
// const schema = new mongoose.Schema({field: type});

// new Class that can be saved in db
// const Cat = mongoose.model("Cat", { field: type});

// new instance of class that can be saved in db
// const kitty = new Cat({ field: value});

// save it
// kitty.save()
// or
// kitty.save().then() => console.log("meow));

// find object in db
// Cat.find( BSON OBJECT )
// Cat.find( {name: /^BeginningOfName/ }, console.log("found sth in db"));

module.exports = server;
