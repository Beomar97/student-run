const GameState = require("../../../../public/js/shared/game/gameState");
const Player = require("../../../../public/js/shared/game/player");
const events = require("../../../../public/js/shared/sync/events");
const UpdateHandler = require("../../../../public/js/sync/updateHandler");
const mocks = require("../../../mocks/mocks");
const gameObjectTypes = require("../../../../public/js/shared/game/gameObjectTypes");
const GameViewController = require("../../../../public/js/view/gameViewController");
const { JSDOM } = require("jsdom");

const dom = new JSDOM();
document = dom.window.document;
window = dom.window;
const Interpolator = require("../../../../public/js/sync/interpolator");

jest.mock("../../../../public/js/sync/interpolator");

let socket = mocks.socket();
let matter = mocks.matter();

jest.mock("../../../../public/js/view/gameViewController");

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
	mocks.util.resetMatterMock(matter);
});

describe("Test the UpdateHandler class", () => {
	test("if init method calls socket.", () => {
		let testee = new UpdateHandler(socket, {}, {}, {}, 0);

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

	test("if _updateGameState method updates gameObjects.", () => {
		let gameState = new GameState();
		gameState.tic = 23;
		let object = { id: 0, innerObject: { thisIsInnerObject: true } };
		gameState.addAll([object]);
		let gameObjectUpdate = {
			id: 0,
		};
		let update = {
			tic: 20,
			gameObjects: [gameObjectUpdate],
		};
		let interpolator = new Interpolator();
		let testee = new UpdateHandler(
			socket,
			gameState,
			interpolator,
			mocks.updateLock(false),
			0
		);

		testee._updateGameState(update, testee);

		expect(interpolator.interpolate).lastCalledWith(
			object,
			gameObjectUpdate,
			gameState.tic,
			update.tic
		);
	});

	test("if _updatePlayer updates player.", () => {
		let player = new Player(0, {});
		let gameState = new GameState();
		gameState.addAll([player]);

		let date = 1618844289;
		let update = {
			id: 0,
			done: true,
			doneAt: date,
		};
		let testee = new UpdateHandler(
			socket,
			gameState,
			new Interpolator(),
			mocks.updateLock(false),
			0,
			new GameViewController()
		);

		testee._updatePlayer([update], testee);
		expect(player.done).toBe(true);
		expect(player.doneAt).toBe(date);
	});

	test("if _applyMovementChange changes player.", () => {
		let id = 0;
		let directionX = 1;
		let player = new Player(id, {});
		let gameState = new GameState();
		gameState.addAll([player]);

		let update = {
			id: id,
			tic: 858,
			direction: directionX,
		};
		let testee = new UpdateHandler(
			socket,
			gameState,
			new Interpolator(),
			mocks.updateLock(false),
			1
		);

		testee._applyMovementChange(update, testee);
		expect(gameState.gameObjects.get(id).direction).toEqual({
			x: directionX,
			y: 0,
		});
	});
});
