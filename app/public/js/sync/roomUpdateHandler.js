const events = require("../shared/sync/events");

class RoomUpdateHandler {
	constructor(clientSync, tableGenerator) {
		this.clientSync = clientSync;
		this.tableGenerator = tableGenerator;
	}

	init() {
		this.clientSync.on(events.ROOM_STATE_UPATE, (roomUpdate) => {
			this._displayPlayers(roomUpdate.waitingPlayers);
		});

		this.clientSync.on(events.PLAYER_ID_ALLOCATION, (playerId) => {
			this._savePlayerId(playerId);
		});

		this.clientSync.on(events.LOAD_GAME, () => {
			this._launchGame();
		});
	}

	_displayPlayers(waitingPlayers) {
		waitingPlayers = JSON.parse(waitingPlayers);
		this.tableGenerator.generate(
			["id", "name"],
			waitingPlayers,
			document.getElementById("players")
		);
	}

	_savePlayerId(playerId) {
		localStorage.setItem("playerId", playerId);
	}

	_launchGame() {
		window.location = "/game.html";
	}
}

module.exports = RoomUpdateHandler;
