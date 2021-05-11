const events = require("../../public/js/shared/sync/events");

class Game {
	constructor(gameLoop, clientEventHandler, syncController) {
		this.gameLoop = gameLoop;
		this.clientEventHandler = clientEventHandler;
		this.syncController = syncController;
	}

	start() {
		this.clientEventHandler.init();
		let startTime = Date.now();
		this.syncController.emit(events.GAME_START, startTime);
		this.gameLoop.start(startTime);
	}

	stop() {
		this.gameLoop.stop();
		this.syncController.emit(events.GAME_STOP);
	}
}

module.exports = Game;
