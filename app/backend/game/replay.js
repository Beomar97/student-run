const logger = require("../logger");

class Replay {
	constructor(gameState, eventQueue, timeline, physicsUpdater) {
		this.gameState = gameState;
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
			this.timeline.applySnapshotBeforeTic(ticOfOldestEvent);
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
}

module.exports = Replay;
