const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const logger = require("../logger");

class Timeline {
	constructor(gameState, physics, maxSnapshots, ticsPerSnapshot) {
		this.gameState = gameState;
		this.physics = physics;
		this.maxSnapshots = maxSnapshots;
		this.ticsPerSnapshot = ticsPerSnapshot;
		this.snapshots = new Map();
		this.snapshotKeysOrdered = [];
		this.gameObjectFilter = (gameObject) => {
			return gameObject.type !== gameObjectTypes.STATIC_OBSTACLE;
		};
	}

	mayCreateSnapshot() {
		if (
			this.gameState.tic % this.ticsPerSnapshot === 0 ||
			this.gameState.tic === 0
		) {
			if (!this.snapshots.has(this.gameState.tic)) {
				//Note: if gameState.tic is smaller than smallest tic in snapshotKeysOrdered then order is lost
				this.snapshotKeysOrdered.push(this.gameState.tic);
			}
			this.snapshots.set(this.gameState.tic, this._createSnapshot());
			if (this.snapshots.size > this.maxSnapshots) {
				this.snapshots.delete(this.snapshotKeysOrdered.shift());
			}
		}
	}

	_createSnapshot() {
		let copiedGameObjects = [];
		this.gameState.forEachGameObject((gameObject) => {
			copiedGameObjects.push(this._copyGameObject(gameObject));
		}, this.gameObjectFilter);
		return {
			tic: this.gameState.tic,
			lastTicTime: this.gameState.lastTicTime,
			gameObjects: copiedGameObjects,
		};
	}

	_copyGameObject(gameObject) {
		let innerObject = gameObject.innerObject;
		let snapshot = {
			id: gameObject.id,
			innerObject: {
				position: {
					x: innerObject.position.x,
					y: innerObject.position.y,
				},
				velocity: {
					x: innerObject.velocity.x,
					y: innerObject.velocity.y,
				},
				force: { x: innerObject.force.x, y: innerObject.force.y },
			},
		};
		if (gameObject.type === gameObjectTypes.PLAYER) {
			snapshot.direction = {
				x: gameObject.direction.x,
				y: gameObject.direction.y,
			};
		}
		return snapshot;
	}

	applySnapshotBeforeTic(tic) {
		let snapshot = this.snapshots.get(
			Math.floor(tic / this.ticsPerSnapshot) * this.ticsPerSnapshot
		);
		if (!snapshot) {
			logger.warn({
				message: "no snapshot available.",
				givenTic: tic,
				ticOfOldestSnapshot: this.snapshotKeysOrdered[0],
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

module.exports = Timeline;
