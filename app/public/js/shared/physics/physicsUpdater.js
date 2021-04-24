class PhysicsUpdater {
	constructor(gameState, updatePhysics, milisPerTic) {
		this.gameState = gameState;
		this.updatePhysics = updatePhysics;
		this.milisPerTic = milisPerTic;
	}

	update(updateUntil) {
		if (this.gameState.lastTicTime + this.milisPerTic <= updateUntil) {
			let delta = updateUntil - this.gameState.lastTicTime;
			let accumulator = delta;

			while (accumulator >= this.milisPerTic) {
				accumulator -= this.milisPerTic;
				this.updatePhysics(this.milisPerTic);
				this.gameState.tic++;
			}

			this.gameState.lastTicTime = updateUntil - accumulator;
		}
	}
}

module.exports = PhysicsUpdater;
