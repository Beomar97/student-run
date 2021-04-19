const events = require("../../public/js/shared/sync/events");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");

class PlayerDetailsPublisher {
	constructor(syncController) {
		this.syncController = syncController;
	}

	publish(gameState) {
		let syncObjects = [];
		gameState.gameObjects.forEach((gameObject) => {
			if (gameObject.type === gameObjectTypes.PLAYER) {
				let player = gameObject;

				syncObjects.push({
					id: player.id,
					done: player.done,
					doneAt: player.doneAt,
				});
			}
		});
		this.syncController.emit(events.PLAYER_DETAILS_UPDATE, syncObjects);
	}
}

module.exports = PlayerDetailsPublisher;
