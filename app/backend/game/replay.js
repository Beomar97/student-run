const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const logger = require("../logger");
const GameObjectBuilder = require("./gameObjectBuilder");

class Replay {
	constructor(gameState, physics, eventQueue, timeline, physicsUpdater) {
		this.gameState = gameState;
		this.physics = physics;
		this.eventQueue = eventQueue;
		this.timeline = timeline;
		this.physicsUpdater = physicsUpdater;
	}

	mayRevertAndReplay() {
		let tic = this.gameState.tic;
		let lastTicTime = this.gameState.lastTicTime;
		let ticOfOldestEvent = this.eventQueue.ticOfOldestEvent;
		if (ticOfOldestEvent && ticOfOldestEvent < this.gameState.tic) {
			logger.debug({
				message: "Rollback to old state.",
				ticDiff: this.gameState.tic - ticOfOldestEvent,
			});
			this._applySnapshotBeforeTic(ticOfOldestEvent);
			this.physicsUpdater.update(lastTicTime);
			if (this.gameState.tic !== tic) {
				logger.warn({
					message: "Detected inconsistency.",
					expectedTic: tic,
					actualTic: this.gameState.tic,
				});
			}
		}
		this.eventQueue.resetTicOfOldestEvent();
	}

	_applySnapshotBeforeTic(tic) {
		let snapshot = this.timeline.getSnapshotBeforeTic(tic);

		if (!snapshot) {
			logger.warn({
				message: "no snapshot available.",
				givenTic: tic,
			});
		}

		this.gameState.tic = snapshot.tic;
		this.gameState.lastTicTime = snapshot.lastTicTime;
		let updatedGameObjectIds = this._applySnapshot(snapshot);
		this._deleteSuperfluousGameObjects(updatedGameObjectIds);
	}

	_applySnapshot(snapshot) {
		let updatedGameObjectIds = new Set();
		snapshot.gameObjects.forEach((gameObjectSnapshot) => {
			let gameObject = this.gameState.getGameObject(
				gameObjectSnapshot.id
			);
			if (!gameObject) {
				gameObject = this._createGameObject(gameObjectSnapshot);
				this.gameState.addAll([gameObject]);
			}
			this._applyGameObjectSnapshot(
				this.gameState.getGameObject(gameObjectSnapshot.id),
				gameObjectSnapshot
			);
			updatedGameObjectIds.add(gameObjectSnapshot.id);
		});
		return updatedGameObjectIds;
	}

	_createGameObject(gameObjectSnapshot) {
		logger.debug({
			message: "Creating new gameObject",
			gameObjectSnapshot: gameObjectSnapshot,
		});

		return new GameObjectBuilder(this.physics)
			.withId(gameObjectSnapshot.id)
			.withGameObjectType(gameObjectSnapshot.type)
			.withX(gameObjectSnapshot.innerObject.position.x)
			.withY(gameObjectSnapshot.innerObject.position.y)
			.withShape(gameObjectSnapshot.metadata.shape)
			.withRadius(gameObjectSnapshot.metadata.radius)
			.withWidth(gameObjectSnapshot.metadata.width)
			.withHeight(gameObjectSnapshot.metadata.height)
			.withIsStatic(gameObjectSnapshot.metadata.isStatic)
			.withFriction(gameObjectSnapshot.metadata.friction)
			.withInteria(gameObjectSnapshot.metadata.interia)
			.withFrictionAir(gameObjectSnapshot.metadata.frictionAir)
			.create();
	}

	_deleteSuperfluousGameObjects(updatedGameObjectIds) {
		this.gameState.forEachGameObject((gameObject) => {
			if (!updatedGameObjectIds.has(gameObject.id)) {
				this.gameState.removeGameObject(gameObject.id);
				this.physics.removeObject(gameObject.innerObject);
			}
		}, this.timeline.gameObjectFilter);
	}

	_applyGameObjectSnapshot(gameObject, snapshot) {
		let innerObject = gameObject.innerObject;
		this.physics.setPosition(innerObject, snapshot.innerObject.position);
		this.physics.setVelocity(innerObject, snapshot.innerObject.velocity);

		if (snapshot.innerObject.force.x || snapshot.innerObject.force.y) {
			logger.error("Did not expect force.");
		}

		if (gameObject.type === gameObjectTypes.PLAYER) {
			gameObject.setDirection(snapshot.direction);
		}
	}
}

module.exports = Replay;
