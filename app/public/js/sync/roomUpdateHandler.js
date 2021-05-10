const events = require("../shared/sync/events");

class RoomUpdateHandler {
	constructor(clientSync, joinViewController) {
		this.clientSync = clientSync;
		this.joinViewController = joinViewController;
	}

	init() {
		this.clientSync.on(events.ROOM_STATE_UPDATE, (roomUpdate) => {
			this._updateView(roomUpdate);
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

	_savePlayerId(playerId) {
		localStorage.setItem("playerId", playerId);
	}

	_clearPlayerId() {
		localStorage.clear();
	}

	_launchGame() {
		window.location = "/game.html";
	}

	_updateView(roomUpdate) {
		let waitingPlayers = JSON.parse(roomUpdate.waitingPlayers);

		this.joinViewController.setGameStatus(roomUpdate.roomLocked);
		this.joinViewController.displayNumberOfPlayers(waitingPlayers.length);
		this.joinViewController.displayPlayersTable(waitingPlayers);
	}
}

module.exports = RoomUpdateHandler;
