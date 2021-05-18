const $ = require("jquery");
const TableGenerator = require("../helper/tableGenerator");

class GameViewController {
	constructor() {
		this.tableGenerator = new TableGenerator();
	}

	displayScoreBoard(players) {
		this.tableGenerator.generate(
			["id", "name", "done", "timeToFinish"],
			players,
			document.getElementById("scoreBoard")
		);
	}

	displayButtons() {
		let buttons = `
				<div class="buttons">
					<a href="index.html">
						<button class="button is-info mr-5">Back Home</button>
					</a>
					<a href="join.html">
						<button class="button is-success" disabled>
							Play again
						</button>
					</a>
				</div>
			`;
		$("#scoreBoard").append(buttons);
	}

	enablePlayAgainButton() {
		$(":button").prop("disabled", false);
	}

	removePhaserWindow() {
		$("#student-run").remove();
	}
}

module.exports = GameViewController;
