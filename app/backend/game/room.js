const Matter = require("matter-js");
const RoomStatePublisher = require("../sync/roomStatePublisher");
const RoomEventHandler = require("../sync/roomEventHandler");
const { Player } = require("../../public/js/shared/game/gameObject");
const Physics = require("../physics/physics");
const id = require("../util/id");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const GameFactory = require("./gameFactory");
const LevelLoader = require("./levelLoader");
const LevelHolder = require("./levelHolder");
const GameObjectBuilder = require("./gameObjectBuilder");

class Room {
	constructor(syncController) {
		this.levelId = 2;
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
			new Player(playerId, gameObjectTypes.PLAYER, {}, 0, playerName)
		);

		this.roomStatePublisher.publishPlayerId(socketId, playerId);
		this.roomStatePublisher.publishRoomUpdate(this);
	}

	initializeGame() {
		let physics = new Physics(Matter);

		this.game = new GameFactory(physics)
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
		let gameObjectCollection = [];

		gameObjectCollection = gameObjectCollection.concat(
			this._getPlayerObjects(physics, new GameObjectBuilder(physics))
		);
		gameObjectCollection = gameObjectCollection.concat(
			this._getLevelObjects(physics)
		);
		physics.addGameObjectsToWorld(gameObjectCollection);

		return gameObjectCollection;
	}

	_getPlayerObjects(physics, gameObjectBuilder) {
		let gameObjectCollection = [];

		this.waitingPlayers.forEach((player) => {
			gameObjectCollection.push(
				gameObjectBuilder
					.withId(player.id)
					.withName(player.name)
					.createPlayer()
			);
		});

		return gameObjectCollection;
	}

	_getLevelObjects(physics) {
		let levelLoader = new LevelLoader();
		let levelHolder = new LevelHolder(
			"../../public/js/shared/levels/",
			levelLoader
		);

		return levelHolder.getLevelObjectsById(this.levelId, physics);
	}
}

module.exports = Room;
