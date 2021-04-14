const GameStatePublisher = require("../sync/gameStatePublisher");
const ClientEventHandler = require("../sync/clientEventHandler");
const Game = require("./game");
const GameLoop = require("./gameLoop");
const GameState = require("../../public/js/shared/game/gameState");

class GameFactory {
	constructor() {
		this.config = {};
		this.syncController;
		this.gameObjects;
		this.physics;
	}

	withMilisPerTick(milisPerTick) {
		this.config.milisPerTick = milisPerTick;
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

	create() {
		this._validate();

		let gameState = new GameState();
		gameState.addAll(this.gameObjects);
		let gameStatePublisher = new GameStatePublisher(this.syncController);
		let actions = this._createActions(gameStatePublisher);
		let gameLoop = new GameLoop(
			gameState,
			actions,
			this.config.milisPerTick
		);
		let clientEventHandler = new ClientEventHandler(
			this.syncController,
			gameState,
			this.physics
		);
		return new Game(gameLoop, clientEventHandler, this.syncController);
	}

	_validate() {
		let isValid =
			!this.config.milisPerTick ||
			!this.syncController ||
			!this.gameObjects ||
			!this.physics;

		if (isValid) {
			throw new Error("Cannot create game. Values are missing.");
		}
	}

	_createActions(gameStatePublisher) {
		let self = this;
		let actions = [];
		actions.push((gameState, milisPerTick) => {
			self.physics.update(milisPerTick);
		});
		actions.push((gameState, milisPerTick) => {
			gameStatePublisher.publish(gameState);
		});
		return actions;
	}
}

module.exports = GameFactory;
