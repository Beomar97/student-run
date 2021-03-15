class Game {
	constructor(gameLoop, clientEventHandler) {
		this.gameLoop = gameLoop;
		this.clientEventHandler = clientEventHandler;
	}

	start() {
		this.clientEventHandler.init();
		this.gameLoop.start();
	}
}

module.exports = Game;
