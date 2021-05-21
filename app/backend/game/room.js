const Matter = require("matter-js");
const RoomStatePublisher = require("../sync/roomStatePublisher");
const RoomEventHandler = require("../sync/roomEventHandler");
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
		this.waitingPlayers = new Map();
		this.game = null;
		this.roomLocked = false;

		this.syncController = syncController;
		this.roomStatePublisher = new RoomStatePublisher(syncController, this);
		this.roomEventHandler = new RoomEventHandler(syncController, this);
		this.roomEventHandler.init();
	}

	addPlayer(socketId, newPlayer) {
		let player = {
			id: id.next(),
			name: newPlayer.name,
			ready: false,
		};
		this.waitingPlayers.set(player.id, player);

		this.roomStatePublisher.publishPlayerId(socketId, player.id);
		this.roomStatePublisher.publishRoomUpdate(this);
	}

	initializeGame() {
		this.roomLocked = true;
		let physics = new Physics(Matter);
		this.game = new GameFactory()
			.inRoom(this)
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
			.withCountdown(1000)
			.create();

		this.roomStatePublisher.loadGame();
	}

	stopGame() {
		this.game.stop();
		this.waitingPlayers = new Map();
		this.game = null;
		id.sequence = 0;
		this.roomLocked = false;
		this.roomStatePublisher.publishRoomUpdate(this);
	}

	_generateGameObjects(physics) {
		let gameObjectCollection = [];

		gameObjectCollection = gameObjectCollection.concat(
			this._getPlayerObjects(new GameObjectBuilder(physics))
		);
		gameObjectCollection = gameObjectCollection.concat(
			this._getLevelObjects(physics)
		);
		physics.addGameObjectsToWorld(gameObjectCollection);

		return gameObjectCollection;
	}

	_getPlayerObjects(gameObjectBuilder) {
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

	playerReady(playerId) {
		this.waitingPlayers.get(playerId).ready = true;
		if (this._allPlayersReady()) {
			this.game.start();
		}
	}

	_allPlayersReady() {
		let allPlayersReady = true;
		this.waitingPlayers.forEach((player) => {
			allPlayersReady = allPlayersReady && player.ready;
		});
		return allPlayersReady;
	}
}

module.exports = Room;
