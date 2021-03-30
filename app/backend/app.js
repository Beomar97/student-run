const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const events = require("../public/js/shared/sync/events");
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

const floor = physics
	.getMatter()
	.Bodies.rectangle(0, 580, 1600, 20, { isStatic: true });

const ledgeOne = physics
	.getMatter()
	.Bodies.rectangle(400, 450, 400, 20, { isStatic: true });

const ledgeTwo = physics
	.getMatter()
	.Bodies.rectangle(0, 300, 600, 20, { isStatic: true });

const ledgeThree = physics
	.getMatter()
	.Bodies.rectangle(700, 200, 800, 20, { isStatic: true });

const player = physics.getMatter().Bodies.circle(250, 250, 20);

physics.getMatter().World.addBody(physics.getEngine().world, floor);
physics.getMatter().World.addBody(physics.getEngine().world, ledgeOne);
physics.getMatter().World.addBody(physics.getEngine().world, ledgeTwo);
physics.getMatter().World.addBody(physics.getEngine().world, ledgeThree);
physics.getMatter().World.addBody(physics.getEngine().world, player);

const game = new GameFactory()
	.withSyncController(syncController)
	.withMilisPerTick(1000 / 40)
	.withPhysics(physics)
	.withGameObjects([
		new GameObject(0 /*id.next()*/, gameObjectTypes.PLAYER, player),
		new GameObject(1 /*id.next()*/, gameObjectTypes.STATIC_OBSTACLE, floor),
		new GameObject(
			2 /*id.next()*/,
			gameObjectTypes.STATIC_OBSTACLE,
			ledgeOne
		),
		new GameObject(
			3 /*id.next()*/,
			gameObjectTypes.STATIC_OBSTACLE,
			ledgeTwo
		),
		new GameObject(
			4 /*id.next()*/,
			gameObjectTypes.STATIC_OBSTACLE,
			ledgeThree
		),
	])
	.create();

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

syncController.control((serverSync) => {
	console.log("Connection " + serverSync.getId());
	serverSync.on(events.MESSAGE, (message) => {
		console.log(message);
		serverSync.emit(events.MESSAGE, "Hallo client");
	});
});
game.start();

module.exports = server;
