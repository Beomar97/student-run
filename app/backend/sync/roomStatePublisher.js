const events = require("../../public/js/shared/sync/events");
const safeStringify = require("fast-safe-stringify");

class RoomStatePublisher {
	constructor(syncController) {
		this.syncController = syncController;
	}

	publishRoomUpdate(room) {
		this.syncController.emit(events.ROOM_STATE_UPATE, {
			waitingPlayers: this._stringifyPlayers(room.waitingPlayers),
		});
	}

	publishInitDone() {
		this.syncController.emit(events.GAME_READY);
	}

	publishPlayerId(socketId, playerId) {
		this.syncController.to(events.PLAYER_JOINED, socketId, {
			playerId: playerId,
		});
	}

	_stringifyPlayers(waitingPlayers) {
		return safeStringify(waitingPlayers);
	}
}

module.exports = RoomStatePublisher;
