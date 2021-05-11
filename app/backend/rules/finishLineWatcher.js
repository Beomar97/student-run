const gameobjectType = require("../../public/js/shared/game/gameObjectTypes");
const logger = require("../logger");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");

class FinishLineWatcher {
	constructor(playerDetailsPublisher, room, gameState, offset) {
		this.gameState = gameState;
		this.room = room;
		this.playerDetailsPublisher = playerDetailsPublisher;
		this.offset = offset;
		this.finishLinePosition = this._getFinishLinePosition(
			gameState.gameObjects
		);
		this.filterByPlayer = (gameObject) => {
			return gameObject.type === gameObjectTypes.PLAYER;
		};
	}

	checkFinishLine(gameState) {
		gameState.forEachGameObject((player) => {
			if (!player.done && this._playerHasCrossedFinishLine(player)) {
				this._markPlayerAsDone(player);
				this.playerDetailsPublisher.publish(this.gameState);

				if (this._isGameDone(gameState)) {
					this.room.stopGame();
				}
			}
		}, this.filterByPlayer);
	}

	_markPlayerAsDone(player) {
		player.done = true;
		player.timeToFinish = Date.now() - this.room.getStartTime();

		logger.log({
			level: "debug",
			message: "Player crossed finish line",
			id: player.id,
			timeToFinish: player.timeToFinish,
		});
	}

	_isGameDone(gameState) {
		let gameDone = true;
		gameState.forEachGameObject((player) => {
			if (!player.done) {
				gameDone = false;
			}
		}, this.filterByPlayer);
		return gameDone;
	}

	_playerHasCrossedFinishLine(player) {
		return player.innerObject.position.x >= this.finishLinePosition;
	}

	_getFinishLinePosition(gameObjects) {
		for (const [id, gameObject] of gameObjects.entries()) {
			if (gameObject.type === gameobjectType.FINISH_LINE) {
				logger.log({
					level: "debug",
					message: "Finish Line detected",
					id: id,
					position: gameObject.innerObject.position.x,
				});
				return gameObject.innerObject.position.x - this.offset;
			}
		}
		throw Error("Game has no finish line!");
	}
}

module.exports = FinishLineWatcher;
