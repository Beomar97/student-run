class UpdateLock {
	constructor(objectId) {
		this.objectId = objectId;
		this.lockedAtTic = -1;
	}

	lock(tic) {
		this.lockedAtTic = tic;
	}

	isLocked(objectId, tic) {
		return objectId === this.objectId && this.lockedAtTic > tic;
	}
}

module.exports = UpdateLock;
