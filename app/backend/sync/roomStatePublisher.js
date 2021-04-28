const events = require("../../public/js/shared/sync/events");
const safeStringify = require("fast-safe-stringify");

class RoomStatePublisher {
	constructor(syncController) {
		this.syncController = syncController;
	}

	publishRoomUpdate(room) {
		this.syncController.emit(events.ROOM_STATE_UPATE, {
			waitingPlayers: this._stringifyPlayers(
				Array.from(room.waitingPlayers.values()) //TODO publish not all player information
			),
		});
	}

	loadGame() {
		this.syncController.emit(events.LOAD_GAME);
	}

	publishPlayerId(socketId, playerId) {
		this.syncController.to(events.PLAYER_ID_ALLOCATION, socketId, playerId);
	}

	_stringifyPlayers(waitingPlayers) {
		return safeStringify(waitingPlayers);
	}
}

module.exports = RoomStatePublisher;
