const events = require("../shared/sync/events");

class UpdateHandler {
	constructor(
		clientSync,
		gameState,
		interpolator,
		updateLock,
		myPlayerId,
		gameViewController
	) {
		this.clientSync = clientSync;
		this.gameState = gameState;
		this.interpolator = interpolator;
		this.updateLock = updateLock;
		this.myPlayerId = myPlayerId;
		this.gameViewController = gameViewController;
		this.finished = false;
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
			this._applyMovementChange.bind(this)
		);
		this.clientSync.on(events.PLAYER_JUMP, this._applyJump.bind(this));
	}

	_applyMovementChange(movementChangeEvent) {
		if (movementChangeEvent.id !== this.myPlayerId) {
			let player = this.gameState.getGameObject(movementChangeEvent.id);
			player.setDirectionX(movementChangeEvent.direction);
		}
	}

	_applyJump(playerJumpEvent) {
		if (playerJumpEvent.id !== this.myPlayerId) {
			let player = this.gameState.getGameObject(playerJumpEvent.id);
			player.setDirectionY(1);
		}
	}

	_updateGameState(gameStateUpdate) {
		gameStateUpdate.gameObjects.forEach((gameObjectUpdate) => {
			if (
				!this.updateLock.isLocked(
					gameObjectUpdate.id,
					gameStateUpdate.tic,
					this.gameState.tic - gameStateUpdate.tic
				)
			) {
				this.interpolator.interpolate(
					this.gameState.getGameObject(gameObjectUpdate.id),
					gameObjectUpdate,
					this.gameState.tic,
					gameStateUpdate.tic
				);
			}
		});
	}

	_updatePlayer(players) {
		players.forEach((playerUpdate) => {
			let localPlayer = this.gameState.getGameObject(playerUpdate.id);
			localPlayer.done = playerUpdate.done;
			localPlayer.doneAt = playerUpdate.doneAt;

			if (localPlayer.done) {
				this.finished = true;
			}
		});

		if (this.finished) {
			this.gameViewController.displayScoreBoard(players);
			this.gameViewController.displayButtons();
		}

		if (players.every((player) => player.done === true)) {
			this.gameViewController.enablePlayAgainButton();
		}
	}
}

module.exports = UpdateHandler;
