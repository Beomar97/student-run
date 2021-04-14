const PhysicsUpdater = require("../../public/js/shared/physics/physicsUpdater");

class GameLoop {
	constructor(gameState, actions, milisPerTick) {
		this.gameState = gameState;
		this.actions = actions;
		this.milisPerTick = milisPerTick;
		this.running = false;
		this.physicsUpdater = new PhysicsUpdater(
			this.gameState,
			this._update.bind(this),
			this.milisPerTick
		);
	}

	start(startTime) {
		if (startTime) {
			this.gameState.lastTicTime = startTime;
		} else {
			this.gameState.lastTicTime = Date.now() - this.milisPerTick;
		}
		this.running = true;
		this._gameLoop();
	}

	_gameLoop() {
		if (this.running) {
			this.physicsUpdater.update();

			if (
				Date.now() - this.gameState.lastTicTime <
				this.milisPerTick - 16
			) {
				setTimeout(this._gameLoop.bind(this));
			} else {
				setImmediate(this._gameLoop.bind(this));
			}
		}
	}

	_update(delta) {
		this.actions.forEach((action) => action(this.gameState, delta));
	}

	stop() {
		this.running = false;
	}
}

module.exports = GameLoop;
