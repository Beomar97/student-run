const events = require("../../public/js/shared/sync/events");

class RoomEventHandler {
	constructor(syncController, room) {
		this.syncController = syncController;
		this.room = room;
	}

	init() {
		this.syncController.control((serverSync) => {
			this.room.roomStatePublisher.publishRoomUpdate(this.room);

			serverSync.on(events.PLAYER_JOINED, (newPlayer) => {
				this._handlePlayerJoinedEvent(serverSync.getId(), newPlayer);
			});

			serverSync.on(events.INITIALIZE_GAME, () => {
				this._handleInitializeGame();
			});
		});
	}

	_handlePlayerJoinedEvent(socketId, newPlayer) {
		this.room.addPlayer(socketId, newPlayer);
	}

	_handleInitializeGame() {
		this.room.initializeGame();
	}
}

module.exports = RoomEventHandler;
