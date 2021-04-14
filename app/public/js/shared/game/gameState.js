class GameState {
	constructor() {
		this.gameObjects = new Map();
		this.tic = 0;
		this.lastTicTime;
	}

	addAll(gameObjects) {
		let self = this;
		gameObjects.forEach((gameObject) =>
			self.gameObjects.set(gameObject.id, gameObject)
		);
	}

	getGameObject(id) {
		return this.gameObjects.get(id);
	}
}

module.exports = GameState;
