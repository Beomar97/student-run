const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const GameViewController = require("../../../../public/js/view/gameViewController");

const dom = new JSDOM();
document = dom.window.document;
window = dom.window;

jest.mock("../../../../public/js/helper/tableGenerator");

describe("Test the GameViewController class", () => {
	test("if displayScoreBoard generates a table.", () => {
		let testData = {
			waitingPlayers: [
				{
					id: 0,
					type: "player",
					innerObject: {},
					baseForce: 0,
					moving: false,
					direction: { x: 0, y: 0 },
					done: true,
					doneAt: 1618844289,
					name: "Mustermann",
				},
			],
		};
		let testee = new GameViewController();
		testee.displayScoreBoard(JSON.stringify(testData));

		expect(testee.tableGenerator.generate).toHaveBeenCalled();
	});
});
