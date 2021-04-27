const Matter = require("matter-js");
const RoomStatePublisher = require("../sync/roomStatePublisher");
const RoomEventHandler = require("../sync/roomEventHandler");
const { Player } = require("../../public/js/shared/game/gameObject");
const Physics = require("../physics/physics");
const id = require("../util/id");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const GameFactory = require("./gameFactory");
const LevelLoader = require("../game/levelLoader");

class Room {
	constructor(syncController) {
		this.levelId = 0;
		this.waitingPlayers = [];
		this.game = null;

		this.syncController = syncController;
		this.roomEventHandler = new RoomEventHandler(syncController, this);
		this.roomEventHandler.init();

		this.roomStatePublisher = new RoomStatePublisher(syncController, this);
	}

	addPlayer(socketId, newPlayer) {
		let playerId = id.next();
		let playerName = newPlayer.name;

		this.waitingPlayers.push(
			new Player(playerId, gameObjectTypes.PLAYER, {}, 0.005, playerName)
		);

		this.roomStatePublisher.publishPlayerId(socketId, playerId);
		this.roomStatePublisher.publishRoomUpdate(this);
	}

	initializeGame() {
		let physics = new Physics(Matter);

		this.game = new GameFactory()
			.withSyncController(this.syncController)
			.withMilisPerTic(1000 / 40)
			.withTicsPerPublish(4)
			.withMaxSnapshots(10)
			.withTicsPerSnapshot(8)
			.withMaxEntriesEventQueue(80)
			.withAllowedEventMaxAge(70)
			.withPhysics(physics)
			.withGameObjects(this._generateGameObjects(physics))
			.withFinishLineOffset(50)
			.create();

		this.game.start();
		this.roomStatePublisher.publishInitDone();
	}

	_generateGameObjects(physics) {
		let levelLoader = new LevelLoader(
			"../../public/js/shared/levels/",
			physics
		);

		this.waitingPlayers.forEach((player) => {
			player.innerObject = physics
				.getMatter()
				.Bodies.circle(300, 300, 25, {
					frictionAir: 0.3,
				});
		});
		let gameObjectCollection = this.waitingPlayers;
		gameObjectCollection = gameObjectCollection.concat(
			levelLoader.getLevelObjectsById(0)
		);
		gameObjectCollection.forEach((gameObject) => {
			physics
				.getMatter()
				.World.addBody(
					physics.getEngine().world,
					gameObject.innerObject
				);
		});
		return gameObjectCollection;
	}
}

module.exports = Room;
