class GameState {
	constructor() {
		this.gameObjects = new Map();
		this.tic = 0;
		this.lastTicTime = null;
		this.startTime = null;
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

	getGameObjectByInnerObjectId(id) {
		let foundGameObject = null;
		this.forEachGameObject(
			(gameObject) => {
				foundGameObject = gameObject;
			},
			(gameObject) => gameObject.innerObject.id === id
		);
		return foundGameObject;
	}

	removeGameObject(id) {
		this.gameObjects.delete(id);
	}
}

module.exports = GameState;
