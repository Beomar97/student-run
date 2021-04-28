class PhysicsUpdater {
	constructor(gameState, updatePhysics, milisPerTic, logger) {
		this.gameState = gameState;
		this.updatePhysics = updatePhysics;
		this.milisPerTic = milisPerTic;
		this.logger = logger;
	}

	update(updateUntil) {
		if (this.gameState.lastTicTime + this.milisPerTic <= updateUntil) {
			let delta = updateUntil - this.gameState.lastTicTime;
			let accumulator = delta;

			while (accumulator >= this.milisPerTic) {
				accumulator -= this.milisPerTic;
				this.updatePhysics(this.milisPerTic);
				this.gameState.tic++;
				this.gameState.lastTicTime += this.milisPerTic;
			}
			this._logUpdateDone();
		}
	}

	_logUpdateDone() {
		if (
			this.logger &&
			(this.gameState.tic === 0 || this.gameState.tic % 100 === 0)
		) {
			this.logger.log({
				message: "tic at",
				tic: this.gameState.tic,
				lastTicTime: this.gameState.lastTicTime,
				now: Date.now(),
			});
		}
	}
}

module.exports = PhysicsUpdater;
