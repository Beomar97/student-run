class PhysicsUpdater {
	constructor(gameState, updatePhysics, milisPerTick) {
		this.gameState = gameState;
		this.updatePhysics = updatePhysics;
		this.milisPerTick = milisPerTick;
		this.accumulator = 0;
	}

	update() {
		let now = Date.now();

		if (this.gameState.lastTicTime + this.milisPerTick <= now) {
			let delta = now - this.gameState.lastTicTime;
			this.accumulator += delta;

			while (this.accumulator >= this.milisPerTick) {
				this.accumulator -= this.milisPerTick;
				this.gameState.tic++;
				this.updatePhysics(this.milisPerTick);
			}

			this.gameState.lastTicTime = now;
		}
	}
}

module.exports = PhysicsUpdater;
