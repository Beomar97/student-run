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
}

module.exports = UpdateHandler;
