const gameObjectTypes = require("./gameObjectTypes");

class Timeline {
	constructor(gameState, maxSnapshots, ticsPerSnapshot, copyMetadata) {
		this.gameState = gameState;
		this.maxSnapshots = maxSnapshots;
		this.ticsPerSnapshot = ticsPerSnapshot;
		this.copyMetadata = copyMetadata;
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
			type: gameObject.type,
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

		if (this.copyMetadata) {
			// Note: collisionCategory gets not copied
			snapshot.metadata = {
				shape: gameObject.innerObject.metadata.shape,
				radius: gameObject.innerObject.metadata.radius,
				width: gameObject.innerObject.metadata.width,
				height: gameObject.innerObject.metadata.height,
				isStatic: gameObject.innerObject.isStatic,
				friction: gameObject.innerObject.friction,
				frictionAir: gameObject.innerObject.frictionAir,
				interia: gameObject.innerObject.interia,
			};
		}

		return snapshot;
	}

	getSnapshot(tic) {
		return this.snapshots.get(tic);
	}

	getGameObjectAtTic(tic, gameObjectId) {
		let snapshot = this.getSnapshot(tic);
		if (snapshot) {
			return snapshot.gameObjects.find(
				(gameObject) => gameObject.id === gameObjectId
			);
		}
		return null;
	}

	getSnapshotBeforeTic(tic) {
		return this.snapshots.get(
			Math.floor(tic / this.ticsPerSnapshot) * this.ticsPerSnapshot
		);
	}
}

module.exports = Timeline;
