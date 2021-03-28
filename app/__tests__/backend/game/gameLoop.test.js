const GameState = require("../../../public/js/shared/game/gameState");
const GameLoop = require("../../../backend/game/gameLoop");

describe("Test the GameLoop class", () => {
	test("if start method starts loop with actions.", () => {
		jest.useFakeTimers();

		let gameState = new GameState();
		let action = jest.fn((gameState, milisPerTick) => {});
		let actions = [action];
		let milisPerTick = 1000 / 40;
		let testee = new GameLoop(gameState, actions, milisPerTick);

		testee.start();
		jest.advanceTimersByTime(milisPerTick);
		expect(action).lastCalledWith(gameState, milisPerTick);
		expect(action.mock.calls.length).toBe(1);
	});

	test("if stop method stops loop.", () => {
		jest.useFakeTimers();

		let gameState = new GameState();
		let action = jest.fn((gameState, milisPerTick) => {});
		let actions = [action];
		let milisPerTick = 1000 / 40;
		let testee = new GameLoop(gameState, actions, milisPerTick);

		testee.start();
		testee.stop();
		jest.advanceTimersByTime(milisPerTick);
		expect(action.mock.calls.length).toBe(0);
	});
});
