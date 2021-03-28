class GameLoop {
	constructor(gameState, actions, milisPerTick) {
		this.gameState = gameState;
		this.actions = actions;
		this.milisPerTick = milisPerTick;
		this.loop;
	}

	start() {
		let self = this;
		this.loop = setInterval(() => {
			self.actions.forEach((action) =>
				action(self.gameState, self.milisPerTick)
			);
		}, self.milisPerTick);
	}

	stop() {
		if (this.loop) {
			clearInterval(this.loop);
		}
	}
}

module.exports = GameLoop;
