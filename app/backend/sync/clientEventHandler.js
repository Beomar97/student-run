const events = require("../../public/js/shared/sync/events");
const logger = require("../logger");

class ClientEventHandler {
	constructor(syncController, gameState, physics) {
		this.syncController = syncController;
		this.gameState = gameState;
		this.physics = physics;
	}

	init() {
		let self = this;
		this.syncController.control((serverSync) => {
			logger.log({
				level: "info",
				message: "Connection established",
				id: serverSync.getId(),
			});
			serverSync.on(events.START_MOVING_LEFT, (positionUpdate) =>
				this._startMovingLeft(
					self,
					positionUpdate.id,
					positionUpdate.timestamp
				)
			);
			serverSync.on(events.START_MOVING_RIGHT, (positionUpdate) =>
				this._startMovingRight(
					self,
					positionUpdate.id,
					positionUpdate.timestamp
				)
			);
			serverSync.on(events.START_MOVING_UP, (positionUpdate) =>
				this._startMovingUp(
					self,
					positionUpdate.id,
					positionUpdate.timestamp
				)
			);
		});
	}

	_startMovingLeft(self, id, timestamp) {
		let player = self.gameState.getGameObject(id).innerObject;
		logger.log({
			level: "debug",
			message: "Start moving",
			direction: "left",
			id: id,
			positionX: player.position.x,
			positionY: player.position.y,
			latencyMS: Date.now() - timestamp,
		});

		this.physics.applyForce(player, player.position, { x: -0.005, y: 0 });
	}

	_startMovingRight(self, id, timestamp) {
		let player = self.gameState.getGameObject(id).innerObject;
		logger.log({
			level: "debug",
			message: "Start moving",
			direction: "right",
			id: id,
			positionX: player.position.x,
			positionY: player.position.y,
			latencyMS: Date.now() - timestamp,
		});

		this.physics.applyForce(player, player.position, { x: 0.005, y: 0 });
	}

	_startMovingUp(self, id, timestamp) {
		let player = self.gameState.getGameObject(id).innerObject;
		logger.log({
			level: "debug",
			message: "Start moving",
			direction: "up",
			id: id,
			positionX: player.position.x,
			positionY: player.position.y,
			latencyMS: Date.now() - timestamp,
		});

		this.physics.applyForce(player, player.position, { x: 0, y: -0.005 });
	}
}

module.exports = ClientEventHandler;
