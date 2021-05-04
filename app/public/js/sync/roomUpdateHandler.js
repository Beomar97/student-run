const events = require("../shared/sync/events");
const $ = require("jquery");

class RoomUpdateHandler {
	constructor(clientSync, tableGenerator) {
		this.clientSync = clientSync;
		this.tableGenerator = tableGenerator;
	}

	init() {
		this.clientSync.on(events.ROOM_STATE_UPDATE, (roomUpdate) => {
			this._displayPlayers(roomUpdate.waitingPlayers);
			this._blockJoinGame(roomUpdate.roomLocked);
		});

		this.clientSync.on(events.PLAYER_ID_ALLOCATION, (playerId) => {
			this._savePlayerId(playerId);
		});

		this.clientSync.on(events.LOAD_GAME, () => {
			this._launchGame();
		});

		this.clientSync.on(events.GAME_STOP, () => {
			this._clearPlayerId();
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

	_clearPlayerId() {
		localStorage.clear();
	}

	_launchGame() {
		window.location = "/game.html";
	}

	_blockJoinGame(roomLocked) {
		let buttonsDisabled;
		let text;

		if (roomLocked) {
			buttonsDisabled = true;
			text = "Game is Running, can't join";
		} else {
			buttonsDisabled = false;
			text = "Game is not Running, you may join";
		}

		$("#gameStatus").text(text);
		$(":button").prop("disabled", buttonsDisabled);
	}
}

module.exports = RoomUpdateHandler;
