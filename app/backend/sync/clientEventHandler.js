const events = require("../../public/js/shared/sync/events");

class ClientEventHandler {
	constructor(syncController, gameState, physics) {
		this.syncController = syncController;
		this.gameState = gameState;
		this.physics = physics;
	}

	init() {
		let self = this;
		this.syncController.control((serverSync) => {
			console.log("Connection " + serverSync.getId());
			serverSync.on(events.START_MOVING_LEFT, (positionUpdate) =>
				this._startMovingLeft(
					self,
					positionUpdate.id,
				)
			);
			serverSync.on(events.START_MOVING_RIGHT, (positionUpdate) =>
				this._startMovingRight(
					self,
					positionUpdate.id,
				)
			);
			serverSync.on(events.START_MOVING_UP, (positionUpdate) =>
				this._startMovingUp(
					self,
					positionUpdate.id,
				)
			);
		});
	}

	_startMovingLeft(self, id) {
		let player = self.gameState.getGameObject(id).innerObject;
		console.log(
			"start moving left. id: " +
				id +
				". position: " +
				JSON.stringify(player.position)
		);
		
		this.physics.applyForce(
			self.gameState.getGameObject(id).innerObject,
			player.position,
			{ x: -0.001, y: 0 }
		);
	}

	_startMovingRight(self, id) {
		let player = self.gameState.getGameObject(id).innerObject;
		console.log(
			"start moving right. id: " +
				id +
				". position: " +
				JSON.stringify(player.position)
		);
		
		this.physics.applyForce(
			self.gameState.getGameObject(id).innerObject,
			player.position,
			{ x: 0.001, y: 0 }
		);
	}

	_startMovingUp(self, id) {
		let player = self.gameState.getGameObject(id).innerObject;
		console.log(
			"start moving up. id: " +
				id +
				". position: " +
				JSON.stringify(player.position)
		);
		
		this.physics.applyForce(
			self.gameState.getGameObject(id).innerObject,
			player.position,
			{ x: 0, y: -0.001 }
		);
	}
}

module.exports = ClientEventHandler;
