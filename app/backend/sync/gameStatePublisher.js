const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const events = require("../../public/js/shared/sync/events");

class GameStatePublisher {
	constructor(syncController, ticsPerPublish) {
		this.syncController = syncController;
		this.ticsPerPublish = ticsPerPublish;
		this.publishFilter = (gameObject) => {
			return (
				gameObject.type !== gameObjectTypes.STATIC_OBSTACLE &&
				gameObject.type !== gameObjectTypes.STATIC_OBSTACLE_SPRITE &&
				gameObject.type !== gameObjectTypes.STATIC_OBSTACLE_TILESPRITE
			);
		};
	}

	publish(gameState) {
		if (gameState.tic % this.ticsPerPublish === 0) {
			let syncObjects = [];
			gameState.forEachGameObject((gameObject) => {
				syncObjects.push({
					id: gameObject.id,
					position: gameObject.innerObject.position,
					velocity: gameObject.innerObject.velocity,
				});
			}, this.publishFilter);
			this.syncController.emit(events.GAME_STATE_UPDATE, {
				tic: gameState.tic,
				gameObjects: syncObjects,
			});
		}
	}
}

module.exports = GameStatePublisher;
