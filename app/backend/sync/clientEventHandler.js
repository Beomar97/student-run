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
			serverSync.on(events.START_MOVING, (positionUpdate) =>
				this._startMoving(
					self,
					positionUpdate.id,
					positionUpdate.position
				)
			);
		});
	}

	_startMoving(self, id, position) {
		console.log(
			"start moving. id: " +
				id +
				". position: " +
				JSON.stringify(position)
		);
		this.physics.setPosition(
			self.gameState.getGameObject(id).innerObject,
			position
		);
	}
}

module.exports = ClientEventHandler;
