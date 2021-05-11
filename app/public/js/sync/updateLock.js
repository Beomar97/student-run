class UpdateLock {
	constructor(objectId) {
		this.objectId = objectId;
		this.lockedAtTic = -1;
	}

	lock(tic) {
		this.lockedAtTic = tic;
	}

	isLocked(objectId, tic, ticDiff) {
		return (
			objectId === this.objectId &&
			this.lockedAtTic + ticDiff * 1.5 >= tic
		);
	}
}

module.exports = UpdateLock;
