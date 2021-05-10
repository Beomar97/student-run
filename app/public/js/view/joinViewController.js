const $ = require("jquery");
const TableGenerator = require("../helper/tableGenerator");

class JoinViewController {
	constructor() {
		this.tableGenerator = new TableGenerator();
	}

	setGameStatus(gameIsRunning) {
		let buttonsDisabled;
		let text;

		if (gameIsRunning) {
			buttonsDisabled = true;
			text = "Game is Running, you can't join";
			$("article").removeClass("is-success").addClass("is-danger");
		} else {
			buttonsDisabled = false;
			text = "Game is not Running, you may join";
			$("article").removeClass("is-danger").addClass("is-success");
		}

		$("#gameStatus").text(text);
		$(":button").prop("disabled", buttonsDisabled);
	}

	displayNumberOfPlayers(numberOfPlayers) {
		let text = `Players ${numberOfPlayers}/8 joined`;
		$("#numberOfPlayers").text(text);
	}

	displayPlayersTable(playerObjects) {
		this.tableGenerator.generate(
			["id", "name"],
			playerObjects,
			document.getElementById("players")
		);
	}
}

module.exports = JoinViewController;
