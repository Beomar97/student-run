class UpdateLock {
	constructor(objectId, lockOffset) {
		this.objectId = objectId;
		this.lockedAtTic = -1;
		this.lockOffset = lockOffset;
	}

	lock(tic) {
		this.lockedAtTic = tic;
	}

	isLocked(objectId, tic, ticDiff) {
		return (
			objectId === this.objectId &&
			this.lockedAtTic + ticDiff + this.lockOffset >= tic
		);
	}
}

module.exports = UpdateLock;
