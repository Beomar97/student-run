const GameStatePublisher = require("../sync/gameStatePublisher");
const FinishLineWatcher = require("../rules/finishLineWatcher");
const ClientEventHandler = require("../sync/clientEventHandler");
const Game = require("./game");
const GameLoop = require("./gameLoop");
const GameState = require("../../public/js/shared/game/gameState");
const PlayerDetailsPublisher = require("../sync/playerDetailsPublisher");
const MoveAction = require("../../public/js/shared/game/moveAction");
const EventQueue = require("./eventQueue");
const Timeline = require("../../public/js/shared/game/timeline");
const GameUpdate = require("./gameUpdate");
const Replay = require("./replay");
const PhysicsUpdater = require("../../public/js/shared/physics/physicsUpdater");
const ItemAction = require("../../public/js/shared/game/itemAction");

class GameFactory {
	constructor() {
		this.config = {};
		this.syncController = null;
		this.gameObjects = null;
		this.physics = null;
		this.finishLineOffset = null;
	}

	withMilisPerTic(milisPerTic) {
		this.config.milisPerTic = milisPerTic;
		return this;
	}

	withTicsPerPublish(ticsPerPublish) {
		this.config.ticsPerPublish = ticsPerPublish;
		return this;
	}

	withMaxSnapshots(maxSnapshots) {
		this.config.maxSnapshots = maxSnapshots;
		return this;
	}

	withTicsPerSnapshot(ticsPerSnapshot) {
		this.config.ticsPerSnapshot = ticsPerSnapshot;
		return this;
	}

	withMaxEntriesEventQueue(maxEntriesEventQueue) {
		this.config.maxEntriesEventQueue = maxEntriesEventQueue;
		return this;
	}

	withAllowedEventMaxAge(allowedEventMaxAge) {
		this.config.allowedEventMaxAge = allowedEventMaxAge;
		return this;
	}

	withSyncController(syncController) {
		this.syncController = syncController;
		return this;
	}

	withPhysics(physics) {
		this.physics = physics;
		return this;
	}

	withGameObjects(gameObjects) {
		this.gameObjects = gameObjects;
		return this;
	}

	withFinishLineOffset(offset) {
		this.finishLineOffset = offset;
		return this;
	}

	inRoom(room) {
		this.room = room;
		return this;
	}

	create() {
		this._validate();

		let gameState = new GameState();
		gameState.addAll(this.gameObjects);
		let playerDetailsPublisher = new PlayerDetailsPublisher(
			this.syncController
		);
		let finishLineWatcher = new FinishLineWatcher(
			playerDetailsPublisher,
			this.room,
			gameState,
			this.finishLineOffset
		);
		let actions = this._createActions(finishLineWatcher);
		let gameStatePublisher = new GameStatePublisher(
			this.syncController,
			this.config.ticsPerPublish
		);
		let timeline = new Timeline(
			gameState,
			this.config.maxSnapshots,
			this.config.ticsPerSnapshot
		);
		let eventQueue = new EventQueue(this.config.maxEntriesEventQueue);
		let gameUpdate = new GameUpdate(
			gameState,
			actions,
			eventQueue,
			timeline
		);
		let physicsUpdater = new PhysicsUpdater(
			gameState,
			gameUpdate.apply.bind(gameUpdate),
			this.config.milisPerTic
		);
		let replay = new Replay(
			gameState,
			this.physics,
			eventQueue,
			timeline,
			physicsUpdater
		);
		let gameLoop = new GameLoop(
			gameState,
			gameStatePublisher,
			gameUpdate,
			replay,
			this.config.milisPerTic
		);
		let clientEventHandler = new ClientEventHandler(
			this.syncController,
			gameState,
			this.physics,
			eventQueue,
			this.config.allowedEventMaxAge
		);
		return new Game(gameLoop, clientEventHandler, this.syncController);
	}

	_validate() {
		let isValid =
			!this.config.milisPerTic ||
			!this.config.ticsPerPublish ||
			!this.config.maxSnapshots ||
			!this.config.ticsPerSnapshot ||
			!this.config.maxEntriesEventQueue ||
			!this.config.allowedEventMaxAge ||
			!this.syncController ||
			!this.room ||
			!this.gameObjects ||
			!this.physics;

		if (isValid) {
			throw new Error("Cannot create game. Values are missing.");
		}
	}

	_createActions(finishLineWatcher) {
		let self = this;
		let actions = [];
		let moveAction = new MoveAction(this.physics);
		actions.push((gameState, milisPerTic) => {
			moveAction.run(gameState);
		});
		let itemAction = new ItemAction(this.physics);
		actions.push((gameState, milisPerTic) => {
			itemAction.run(gameState);
		});
		actions.push((gameState, milisPerTic) => {
			self.physics.update(milisPerTic);
		});
		actions.push((gameState) => {
			finishLineWatcher.checkFinishLine(gameState);
		});
		return actions;
	}
}

module.exports = GameFactory;
