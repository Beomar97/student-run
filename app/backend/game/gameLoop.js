const PhysicsUpdater = require("../../public/js/shared/physics/physicsUpdater");
const logger = require("../logger");

class GameLoop {
	constructor(
		gameState,
		gameStatePublisher,
		gameUpdate,
		replay,
		milisPerTic
	) {
		this.gameState = gameState;
		this.gameStatePublisher = gameStatePublisher;
		this.gameUpdate = gameUpdate;
		this.replay = replay;
		this.milisPerTic = milisPerTic;
		this.running = false;
		this.setTimeoutOffset = 16;
		this.physicsUpdater = new PhysicsUpdater(
			this.gameState,
			this._replayUpdatePublish.bind(this),
			this.milisPerTic,
			{ log: logger.debug.bind(logger) }
		);
	}

	start(startTime) {
		if (startTime) {
			this.gameState.startTime = startTime;
		} else {
			this.gameState.startTime = Date.now() - this.milisPerTic;
		}
		this.gameState.lastTicTime = this.gameState.startTime;
		this.running = true;
		this._gameLoop();
	}

	_gameLoop() {
		if (this.running) {
			let now = Date.now();

			this.physicsUpdater.update(now);

			let diff = Date.now() - now;
			if (diff > this.milisPerTic * 0.8) {
				logger.warn({
					message:
						"Interation needed more than 80% percent of time available",
					duration: diff,
				});
			}

			if (
				Date.now() - this.gameState.lastTicTime <
				this.milisPerTic - this.setTimeoutOffset
			) {
				setTimeout(this._gameLoop.bind(this));
			} else {
				setImmediate(this._gameLoop.bind(this));
			}
		}
	}

	_replayUpdatePublish(delta) {
		this.replay.mayRevertAndReplay();
		this.gameStatePublisher.publish(this.gameState);
		this.gameUpdate.apply(delta);
	}

	stop() {
		this.running = false;
		this.gameState.startTime = null;
	}
}

module.exports = GameLoop;
