const events = require("../../public/js/shared/sync/events");

class Game {
	constructor(gameLoop, clientEventHandler, syncController, countdown) {
		this.gameLoop = gameLoop;
		this.clientEventHandler = clientEventHandler;
		this.syncController = syncController;
		this.countdown = countdown;
	}

	start() {
		this.clientEventHandler.init();
		let startTime = Date.now() + this.countdown;
		this.syncController.emit(events.GAME_START, startTime);
		this.gameLoop.start(startTime);
	}

	stop() {
		this.gameLoop.stop();
		this.syncController.emit(events.GAME_STOP);
	}

	isRunning() {
		return this.gameLoop.running;
	}
}

module.exports = Game;
