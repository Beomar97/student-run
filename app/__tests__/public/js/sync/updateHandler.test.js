const GameState = require("../../../../public/js/shared/game/gameState");
const { Player } = require("../../../../public/js/shared/game/gameObject");
const events = require("../../../../public/js/shared/sync/events");
const UpdateHandler = require("../../../../public/js/sync/updateHandler");
const mocks = require("../../../mocks/mocks");
const gameObjectTypes = require("../../../../public/js/shared/game/gameObjectTypes");

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

	test("if _updateGameState method updates gameObjects.", () => {
		let gameState = new GameState();
		let object = { id: 0, innerObject: { thisIsInnerObject: true } };
		gameState.addAll([object]);
		let gameObjectUpdate = {
			id: 0,
			position: {
				x: 12,
				y: 13,
			},
			velocity: {
				x: 14,
				y: 15,
			},
		};
		let update = {
			tic: 0,
			gameObjects: [gameObjectUpdate],
		};
		let testee = new UpdateHandler(
			socket,
			matter,
			gameState,
			mocks.updateLock(false)
		);

		testee._updateGameState(update, testee);

		expect(matter.body.setPosition).lastCalledWith(
			object.innerObject,
			gameObjectUpdate.position
		);
		expect(matter.body.setVelocity).lastCalledWith(
			object.innerObject,
			gameObjectUpdate.velocity
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

	test("if _applyMovementChange changes player.", () => {
		let id = 0;
		let direction = {
			x: 1,
			y: 0,
		};
		let player = new Player(id, gameObjectTypes.PLAYER, {});
		let gameState = new GameState();
		gameState.addAll([player]);

		let update = {
			id: id,
			tic: 858,
			direction: direction,
		};
		let testee = new UpdateHandler(socket, matter, gameState);

		testee._applyMovementChange(update, testee);
		expect(gameState.gameObjects.get(id).direction).toBe(direction);
	});
});
