const events = require("../shared/sync/events");
const eventHandlers = require("../shared/sync/eventHandlers");

class UpdateHandler {
	constructor(
		clientSync,
		gameState,
		interpolator,
		updateLock,
		myPlayerId,
		gameViewController,
		jukebox
	) {
		this.clientSync = clientSync;
		this.gameState = gameState;
		this.interpolator = interpolator;
		this.updateLock = updateLock;
		this.myPlayerId = myPlayerId;
		this.gameViewController = gameViewController;
		this.jukebox = jukebox;
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
		this.clientSync.on(
			events.PLAYER_COLLECTED_ITEM,
			this._applyItemEffect.bind(this)
		);
		this.clientSync.on(events.PLAYER_JUMP, this._applyJump.bind(this));
	}

	_applyMovementChange(movementChangeEvent) {
		if (movementChangeEvent.id !== this.myPlayerId) {
			eventHandlers.handleMovementChangeEvent(
				this.gameState,
				movementChangeEvent
			);
		}
	}

	_applyJump(playerJumpEvent) {
		if (playerJumpEvent.id !== this.myPlayerId) {
			eventHandlers.handleJumpEvent(this.gameState, playerJumpEvent);
		}
	}

	_applyItemEffect(itemEvent) {
		if (itemEvent.playerId !== this.myPlayerId) {
			eventHandlers.handleItemEvent(
				this.gameState,
				itemEvent,
				(innerObject) => innerObject.gameObject.destroy()
			);
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
			localPlayer.timeToFinish = playerUpdate.timeToFinish;

			if (localPlayer.id === this.myPlayerId && localPlayer.done) {
				this.finished = true;
				this.gameViewController.removePhaserWindow();
				this.jukebox.playDone();
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
