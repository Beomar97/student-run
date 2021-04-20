const events = require("../shared/sync/events");

class UpdateHandler {
	constructor(clientSync, matter, gameState) {
		this.clientSync = clientSync;
		this.matter = matter;
		this.gameState = gameState;
	}

	init() {
		let self = this;
		this.clientSync.on(events.GAME_STATE_UPDATE, (gameObjects) => {
			this._updateGameState(gameObjects, self);
		});
		this.clientSync.on(events.PLAYER_DETAILS_UPDATE, (players) => {
			this._updatePlayer(players, self);
		});
	}

	_updateGameState(gameObjects, self) {
		gameObjects.forEach((serverGameObject) => {
			let gameObject = self.gameState.getGameObject(serverGameObject.id);
			self.matter.body.setPosition(gameObject.innerObject, {
				x: serverGameObject.position.x,
				y: serverGameObject.position.y,
			});
		});
	}

	_updatePlayer(players, self) {
		players.forEach((serverPlayer) => {
			let localPlayer = self.gameState.getGameObject(serverPlayer.id);
			localPlayer.done = serverPlayer.done;
			localPlayer.doneAt = serverPlayer.doneAt;
		});
	}
}

module.exports = UpdateHandler;
