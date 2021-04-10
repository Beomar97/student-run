const GameState = require("../../../../public/js/shared/game/gameState");
const events = require("../../../../public/js/shared/sync/events");
const UpdateHandler = require("../../../../public/js/sync/updateHandler");
const mocks = require("../../../mocks/mocks");

global.events = events;

let socket = mocks.socket();
let matter = mocks.matter();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
	mocks.util.resetMatterMock(matter);
});

describe("Test the UpdateHandler class", () => {
	test("if init method calls socket.", () => {
		let testee = new UpdateHandler(socket, {}, {});

		testee.init();

		expect(socket.on).lastCalledWith(
			events.GAME_STATE_UPDATE,
			expect.any(Function)
		);
	});

	test("if _updateGameState method calls socket.", () => {
		let gameState = new GameState();
		let object = { id: 0, innerObject: { thisIsInnerObject: true } };
		gameState.addAll([object]);
		let update = {
			id: 0,
			position: {
				x: 12,
				y: 13,
			},
		};
		let testee = new UpdateHandler(socket, matter, gameState);

		testee._updateGameState([update], testee);

		expect(matter.body.setPosition).lastCalledWith(
			object.innerObject,
			update.position
		);
	});
});
