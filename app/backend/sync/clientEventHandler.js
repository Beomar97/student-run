const events = require("../../public/js/shared/sync/events");
const logger = require("../logger");

class ClientEventHandler {
	constructor(syncController, gameState, physics, eventQueue, eventMaxAge) {
		this.syncController = syncController;
		this.gameState = gameState;
		this.physics = physics;
		this.eventQueue = eventQueue;
		this.eventMaxAge = eventMaxAge;
	}

	init() {
		this.syncController.control((serverSync) => {
			serverSync.on(
				events.MOVEMENT_CHANGE_EVENT,
				this._handleMoveChangeEvent.bind(this)
			);

			serverSync.on(
				events.PLAYER_JUMP,
				this._handlePlayerJumpEvent.bind(this)
			);
		});
	}

	_handleMoveChangeEvent(movementChangeEvent) {
		this._logEvent(
			"movement change event",
			movementChangeEvent,
			movementChangeEvent.direction
		);

		this.syncController.emit(
			events.MOVEMENT_CHANGE_EVENT,
			movementChangeEvent
		);

		this.eventQueue.enqueue(
			this._evaluateEventTic(movementChangeEvent.tic),
			(() => {
				this._applyMovementChange(movementChangeEvent);
			}).bind(this)
		);
	}

	_handlePlayerJumpEvent(playerJumpEvent) {
		this._logEvent("player jump event", playerJumpEvent);

		this.syncController.emit(events.PLAYER_JUMP, playerJumpEvent);

		this.eventQueue.enqueue(
			this._evaluateEventTic(playerJumpEvent.tic),
			(() => {
				this._applyJump(playerJumpEvent);
			}).bind(this)
		);
	}

	_applyMovementChange(movementChangeEvent) {
		let player = this.gameState.getGameObject(movementChangeEvent.id);
		player.setDirectionX(movementChangeEvent.direction);
	}

	_applyJump(playerJumpEvent) {
		let player = this.gameState.getGameObject(playerJumpEvent.id);
		player.setDirectionY(1);
	}

	_evaluateEventTic(eventTic) {
		let diff = this.gameState.tic - eventTic;
		if (diff > this.eventMaxAge) {
			logger.warn({
				message: "Max age of event exceeded.",
				eventMaxAge: this.eventMaxAge,
				eventTic: eventTic,
				ticDiff: diff,
			});
			return this.gameState.tic - this.eventMaxAge;
		} else {
			return eventTic;
		}
	}

	_logEvent(message, event, additionalInfo) {
		logger.debug({
			message: message,
			id: event.id,
			eventTic: event.tic,
			ticDiff: this.gameState.tic - event.tic,
			additionalInfo: additionalInfo,
		});
	}
}

module.exports = ClientEventHandler;
