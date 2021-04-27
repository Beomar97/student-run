const events = require("../shared/sync/events");

class UpdateHandler {
	constructor(clientSync, matter, gameState, updateLock, myPlayerId) {
		this.clientSync = clientSync;
		this.matter = matter;
		this.gameState = gameState;
		this.updateLock = updateLock;
		this.myPlayerId = myPlayerId;
	}

	init() {
		this.clientSync.on(events.GAME_STATE_UPDATE, (gameStateUpdate) => {
			this._updateGameState(gameStateUpdate);
		});
		this.clientSync.on(events.PLAYER_DETAILS_UPDATE, (players) => {
			this._updatePlayer(players);
		});
		this.clientSync.on(
			events.MOVEMENT_CHANGE_EVENT,
			(movementChangeEvent) => {
				this._applyMovementChange(movementChangeEvent);
			}
		);
	}

	_applyMovementChange(movementChangeEvent) {
		if (movementChangeEvent.id !== this.myPlayerId) {
			let player = this.gameState.getGameObject(movementChangeEvent.id);
			player.setDirection(movementChangeEvent.direction);
		}
	}

	_updateGameState(gameStateUpdate) {
		gameStateUpdate.gameObjects.forEach((serverGameObject) => {
			if (
				!this.updateLock.isLocked(
					serverGameObject.id,
					gameStateUpdate.tic
				)
			) {
				let gameObject = this.gameState.getGameObject(
					serverGameObject.id
				);
				this.matter.body.setPosition(
					gameObject.innerObject,
					serverGameObject.position
				);
				this.matter.body.setVelocity(
					gameObject.innerObject,
					serverGameObject.velocity
				);
			}
		});
	}

	_updatePlayer(players) {
		players.forEach((serverPlayer) => {
			let localPlayer = this.gameState.getGameObject(serverPlayer.id);
			localPlayer.done = serverPlayer.done;
			localPlayer.doneAt = serverPlayer.doneAt;
		});
	}
}

module.exports = UpdateHandler;
