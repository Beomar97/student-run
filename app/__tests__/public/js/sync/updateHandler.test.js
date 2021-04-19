const GameState = require("../../../../public/js/shared/game/gameState");
const { Player } = require("../../../../public/js/shared/game/gameObject");
const events = require("../../../../public/js/shared/sync/events");
const UpdateHandler = require("../../../../public/js/sync/updateHandler");
const mocks = require("../../../mocks/mocks");
const gameObjectTypes = require("../../../../public/js/shared/game/gameObjectTypes");

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

		expect(socket.on).toHaveBeenNthCalledWith(
			1,
			events.GAME_STATE_UPDATE,
			expect.any(Function)
		);

		expect(socket.on).toHaveBeenNthCalledWith(
			2,
			events.PLAYER_DETAILS_UPDATE,
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

	test("if _updatePlayer updates player.", () => {
		let player = new Player(0, gameObjectTypes.PLAYER, {});
		let gameState = new GameState();
		gameState.addAll([player]);

		let date = 1618844289;
		let update = {
			id: 0,
			done: true,
			doneAt: date,
		};
		let testee = new UpdateHandler(socket, matter, gameState);

		testee._updatePlayer([update], testee);
		expect(gameState.gameObjects.get(0).done).toBe(true);
		expect(gameState.gameObjects.get(0).doneAt).toBe(date);
	});
});
