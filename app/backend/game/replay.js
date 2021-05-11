const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const logger = require("../logger");

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
		snapshot.gameObjects.forEach((gameObjectSnapshot) => {
			this._applySnapshot(
				this.gameState.getGameObject(gameObjectSnapshot.id),
				gameObjectSnapshot
			);
		});

		//TODO when items are added: remove created objects, and create removed objects
	}

	_applySnapshot(gameObject, snapshot) {
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
