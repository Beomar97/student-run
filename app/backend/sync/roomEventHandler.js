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

			serverSync.on(events.PLAYER_READY, (playerId) => {
				this._handlePlayerReadyEvent(playerId);
			});
		});
	}

	_handlePlayerJoinedEvent(socketId, newPlayer) {
		this.room.addPlayer(socketId, newPlayer);
	}

	_handleInitializeGame() {
		this.room.initializeGame();
	}

	_handlePlayerReadyEvent(playerId) {
		this.room.playerReady(playerId);
	}
}

module.exports = RoomEventHandler;
