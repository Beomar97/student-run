const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const RoomUpdateHandler = require("../../../../public/js/sync/roomUpdateHandler");
const TableGenerator = require("../../../../public/js/helper/tableGenerator");
const mocks = require("../../../mocks/mocks");
const events = require("../../../../public/js/shared/sync/events");

const dom = new JSDOM();
document = dom.window.document;
window = dom.window;

jest.mock("../../../../public/js/helper/tableGenerator");

let socket = mocks.socket();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
});

describe("Test the RoomUpdateHandler class", () => {
	test("if run method moves movable objects.", () => {
		let testee = new RoomUpdateHandler(socket);
		testee.init();

		expect(socket.on).toHaveBeenNthCalledWith(
			1,
			events.ROOM_STATE_UPATE,
			expect.any(Function)
		);

		expect(socket.on).toHaveBeenNthCalledWith(
			2,
			events.PLAYER_JOINED,
			expect.any(Function)
		);

		expect(socket.on).toHaveBeenNthCalledWith(
			3,
			events.GAME_READY,
			expect.any(Function)
		);
	});

	test("if _displayRoomUpdate generates a table.", () => {
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
		let tableGenerator = new TableGenerator();
		let testee = new RoomUpdateHandler({}, tableGenerator);
		testee._displayPlayers(JSON.stringify(testData));

		expect(tableGenerator.generate).toHaveBeenCalled();
	});

	test("if _savePlayerId saves to local storage.", () => {
		let id = 0;
		localStorage = mocks.localStorage;
		let testee = new RoomUpdateHandler();
		testee._savePlayerId(id);

		expect(localStorage.setItem).toHaveBeenCalled();
	});
});
