const events = require("../../public/js/shared/sync/events");
const safeStringify = require("fast-safe-stringify");

class RoomStatePublisher {
	constructor(syncController) {
		this.syncController = syncController;
	}

	publishRoomUpdate(room) {
		this.syncController.emit(events.ROOM_STATE_UPDATE, {
			waitingPlayers: this._stringifyPlayers(
				Array.from(room.waitingPlayers.values())
			),
			roomLocked: room.roomLocked,
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
