class GameState {
	constructor() {
		this.gameObjects = new Map();
		this.tic = 0;
		this.lastTicTime = null;
	}

	addAll(gameObjects) {
		let self = this;
		gameObjects.forEach((gameObject) =>
			self.gameObjects.set(gameObject.id, gameObject)
		);
	}

	forEachGameObject(consume, filter) {
		this.gameObjects.forEach((gameObject) => {
			if (filter(gameObject)) {
				consume(gameObject);
			}
		});
	}

	getGameObject(id) {
		return this.gameObjects.get(id);
	}
}

module.exports = GameState;
