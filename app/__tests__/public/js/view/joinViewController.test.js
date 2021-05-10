const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const JoinViewController = require("../../../../public/js/view/joinViewController");

const dom = new JSDOM();
document = dom.window.document;
window = dom.window;

jest.mock("../../../../public/js/helper/tableGenerator");

describe("Test the JoinViewController class", () => {
	test("if displayPlayersTable generates a table.", () => {
		let testData = {
			waitingPlayers: [
				{
					id: 0,
					type: "player",
					innerObject: {},
					baseForce: 0,
					moving: false,
					direction: { x: 0, y: 0 },
					done: false,
					doneAt: null,
					name: "Mustermann",
				},
			],
		};
		let testee = new JoinViewController();
		testee.displayPlayersTable(JSON.stringify(testData));

		expect(testee.tableGenerator.generate).toHaveBeenCalled();
	});
});
