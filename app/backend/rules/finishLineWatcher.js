const gameobjectType = require("../../public/js/shared/game/gameObjectTypes");
const logger = require("../logger");

class FinishLineWatcher {
	constructor(playerDetailsPublisher, gameState, offset) {
		this.gameObjects = gameState;
		this.playerDetailsPublisher = playerDetailsPublisher;
		this.offset = offset;
		this.finishLinePosition = this._getFinishLinePosition(
			gameState.gameObjects
		);
	}

	checkFinishLine(gameState) {
		let pendingChanges = false;

		gameState.gameObjects.forEach((gameObject) => {
			if (gameObject.type === gameobjectType.PLAYER) {
				let player = gameObject;
				if (!player.done && this._playerHasCrossedFinishLine(player)) {
					this._markPlayerAsDone(player);
					pendingChanges = true;
				}
			}
		});

		if (pendingChanges === true) {
			this.playerDetailsPublisher.publish(this.gameObjects);
		}
	}

	_markPlayerAsDone(player) {
		player.done = true;
		player.doneAt = Date.now();

		logger.log({
			level: "debug",
			message: "Player crossed finish line",
			id: player.id,
			doneAt: player.doneAt.toString(),
		});
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
