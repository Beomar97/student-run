class CollisionDetector {
	constructor(gameState, physics) {
		this.gameState = gameState;
		this.physics = physics;
	}

	onCollisionStart(onCollisionStart, objectMatcherA, objectMatcherB) {
		this._handleCollisionEvent(
			"collisionstart",
			onCollisionStart,
			objectMatcherA,
			objectMatcherB
		);
	}

	onCollisionEnd(onCollisionEnd, objectMatcherA, objectMatcherB) {
		this._handleCollisionEvent(
			"collisionend",
			onCollisionEnd,
			objectMatcherA,
			objectMatcherB
		);
	}

	_handleCollisionEvent(eventName, callback, objectMatcherA, objectMatcherB) {
		this.physics.on(
			eventName,
			((event, bodyA, bodyB) => {
				let matchedGameObjects = this._matchGameObjects(
					this._getGameObjects(bodyA, bodyB),
					objectMatcherA,
					objectMatcherB
				);
				if (matchedGameObjects != null) {
					callback(
						matchedGameObjects.gameObjectA,
						matchedGameObjects.gameObjectB
					);
				}
			}).bind(this)
		);
	}

	_getGameObjects(bodyA, bodyB) {
		return [
			this.gameState.getGameObjectByInnerObjectId(bodyA.id),
			this.gameState.getGameObjectByInnerObjectId(bodyB.id),
		];
	}

	_matchGameObjects(gameObjects, objectMatcherA, objectMatcherB) {
		let gameObjectA = null;
		let gameObjectB = null;

		gameObjects.forEach((gameObject) => {
			if (gameObject && objectMatcherA.matches(gameObject)) {
				gameObjectA = gameObject;
			}
			if (gameObject && objectMatcherB.matches(gameObject)) {
				gameObjectB = gameObject;
			}
		});

		if (gameObjectA && gameObjectB && gameObjectA.id !== gameObjectB.id) {
			return { gameObjectA: gameObjectA, gameObjectB: gameObjectB };
		} else {
			return null;
		}
	}
}

gameObjectMatchers = {
	byId: (id) => {
		return { matches: (gameObject) => gameObject.id === id };
	},
	byTypes: (types) => {
		return {
			matches: (gameObject) =>
				types.some((type) => gameObject.type === type),
		};
	},
};

module.exports = { CollisionDetector, gameObjectMatchers };
