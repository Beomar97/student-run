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
				events.PLAYER_COLLECTED_ITEM,
				this._handleItemEvent.bind(this)
			);
			serverSync.on(
				events.PLAYER_JUMP,
				this._handlePlayerJumpEvent.bind(this)
			);
		});
	}

	_handleItemEvent(itemEvent) {
		this._logEvent("item event", itemEvent, "Player: " + itemEvent.playerId);

		this.syncController.emit(events.PLAYER_COLLECTED_ITEM, itemEvent);

		this.eventQueue.enqueue(
			this._evaluateEventTic(itemEvent.tic),
			(() => {
				this._applyItemEffect(itemEvent);
			}).bind(this)
		);
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

	_applyItemEffect(itemEvent) {
		let player = this.gameState.getGameObject(itemEvent.playerId);
		let item = this.gameState.getGameObject(itemEvent.itemId);
		player.item = item;
		this.gameState.removeGameObject(item.id);
		this.physics.removeObject(item.innerObject);
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
