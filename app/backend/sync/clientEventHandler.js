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
			logger.info({
				message: "Connection established",
				id: serverSync.getId(),
			});

			serverSync.on(
				events.MOVEMENT_CHANGE_EVENT,
				this._handleMoveChangeEvent.bind(this)
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

	_applyMovementChange(movementChangeEvent) {
		let player = this.gameState.getGameObject(movementChangeEvent.id);
		player.setDirection(movementChangeEvent.direction);
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
