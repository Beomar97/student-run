const GameState = require("../../../public/js/shared/game/gameState");
const GameLoop = require("../../../backend/game/gameLoop");
const GameStatePublisher = require("../../../backend/sync/gameStatePublisher");
const GameUpdate = require("../../../backend/game/gameUpdate");
const Replay = require("../../../backend/game/replay");

jest.mock("../../../backend/sync/gameStatePublisher");
jest.mock("../../../backend/game/gameUpdate");
jest.mock("../../../backend/game/replay");

beforeEach(() => {
	GameStatePublisher.mockClear();
	GameUpdate.mockClear();
	Replay.mockClear();
	jest.clearAllTimers();
});

describe("Test the GameLoop class", () => {
	test("if start method starts loop.", () => {
		jest.useFakeTimers();

		let gameState = new GameState();
		let gameStatePublisher = new GameStatePublisher();
		let gameUpdate = new GameUpdate();
		let replay = new Replay();
		let milisPerTic = 1000 / 40;
		let testee = new GameLoop(
			gameState,
			gameStatePublisher,
			gameUpdate,
			replay,
			milisPerTic
		);

		testee.start(Date.now());
		gameState.lastTicTime -= milisPerTic;
		jest.runOnlyPendingTimers();

		expect(replay.mayRevertAndReplay).toHaveBeenCalled();
		expect(gameUpdate.apply).lastCalledWith(milisPerTic);
		expect(gameStatePublisher.publish).lastCalledWith(gameState);
		expect(replay.mayRevertAndReplay).toHaveBeenCalledTimes(1);
		expect(gameUpdate.apply).toHaveBeenCalledTimes(1);
		expect(gameStatePublisher.publish).toHaveBeenCalledTimes(1);
	});

	test("if stop method stops loop.", () => {
		jest.useFakeTimers();

		let gameState = new GameState();
		let gameStatePublisher = new GameStatePublisher();
		let gameUpdate = new GameUpdate();
		let replay = new Replay();
		let milisPerTic = 1000 / 40;
		let testee = new GameLoop(
			gameState,
			gameStatePublisher,
			gameUpdate,
			replay,
			milisPerTic
		);

		testee.start(Date.now());
		testee.stop();
		jest.runAllTimers();

		expect(replay.mayRevertAndReplay).toHaveBeenCalledTimes(0);
		expect(gameUpdate.apply).toHaveBeenCalledTimes(0);
		expect(gameStatePublisher.publish).toHaveBeenCalledTimes(0);
	});

	test("if gameState has startTime after starting loop", () => {
		jest.useFakeTimers();

		let gameState = new GameState();
		let gameStatePublisher = new GameStatePublisher();
		let gameUpdate = new GameUpdate();
		let replay = new Replay();
		let milisPerTic = 1000 / 40;
		let testee = new GameLoop(
			gameState,
			gameStatePublisher,
			gameUpdate,
			replay,
			milisPerTic
		);

		let startTime = Date.now();
		testee.start(startTime);
		expect(gameState.startTime).toEqual(startTime);
		testee.stop();
		expect(gameState.startTime).toBeFalsy();

		jest.runAllTimers();
	});
});
