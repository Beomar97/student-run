const events = require("../../public/js/shared/sync/events");

class Game {
	constructor(gameLoop, clientEventHandler, syncController) {
		this.gameLoop = gameLoop;
		this.clientEventHandler = clientEventHandler;
		this.syncController = syncController;
	}

	start() {
		this.clientEventHandler.init();

		this.syncController.control((serverSync) => {
			// when client connects -> game starts
			let startTime = Date.now() + 1000; //TODO move to GameFactory
			this.syncController.emit(events.GAME_START, startTime);
			this.gameLoop.start(startTime);
		});
	}
}

module.exports = Game;
