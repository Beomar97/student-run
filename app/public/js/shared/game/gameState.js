class GameState {
	constructor() {
		this.gameObjects = new Map();
		this.innerObjectIdMap = new Map();
		this.tic = 0;
		this.lastTicTime = null;
		this.startTime = null;
	}

	addAll(gameObjects) {
		gameObjects.forEach((gameObject) => {
			this.gameObjects.set(gameObject.id, gameObject);
			this.innerObjectIdMap.set(gameObject.innerObject.id, gameObject.id);
		});
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
		return this.gameObjects.get(this.innerObjectIdMap.get(id));
	}

	removeGameObject(id) {
		let gameObject = this.gameObjects.get(id);
		this.innerObjectIdMap.delete(gameObject.innerObject.id);
		this.gameObjects.delete(id);
	}
}

module.exports = GameState;
