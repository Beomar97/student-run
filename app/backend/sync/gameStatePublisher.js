const events = require("../../public/js/shared/sync/events");

class GameStatePublisher {
	constructor(syncController) {
		this.syncController = syncController;
	}

	publish(gameState) {
		let syncObjects = [];
		gameState.gameObjects.forEach((gameObject) => {
			syncObjects.push({
				id: gameObject.id,
				position: gameObject.innerObject.position,
			});
		});
		this.syncController.emit(events.GAME_STATE_UPDATE, syncObjects);
	}
}

module.exports = GameStatePublisher;
