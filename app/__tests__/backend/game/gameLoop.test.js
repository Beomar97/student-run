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

		testee.start();
		gameState.lastTicTime -= milisPerTic;
		jest.runOnlyPendingTimers();

		expect(replay.mayRevertAndReplay).toHaveBeenCalled();
		expect(gameUpdate.apply).lastCalledWith(milisPerTic);
		expect(gameStatePublisher.publish).lastCalledWith(gameState);
		expect(replay.mayRevertAndReplay).toHaveBeenCalledTimes(2);
		expect(gameUpdate.apply).toHaveBeenCalledTimes(2);
		expect(gameStatePublisher.publish).toHaveBeenCalledTimes(2);
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

		testee.start();
		testee.stop();
		jest.runAllTimers();

		// when gameLoop starts the actions get called once right away
		expect(replay.mayRevertAndReplay).toHaveBeenCalledTimes(1);
		expect(gameUpdate.apply).toHaveBeenCalledTimes(1);
		expect(gameStatePublisher.publish).toHaveBeenCalledTimes(1);
	});
});
