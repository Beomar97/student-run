const Timeline = require("../../../backend/game/timeline");
const Replay = require("../../../backend/game/replay");
const GameState = require("../../../public/js/shared/game/gameState");
const PhysicsUpdater = require("../../../public/js/shared/physics/physicsUpdater");

jest.mock("../../../backend/game/timeline");
jest.mock("../../../public/js/shared/physics/physicsUpdater");

beforeEach(() => {
	Timeline.mockClear();
	PhysicsUpdater.mockClear();
});

describe("Test the Replay class", () => {
	test("if mayRevertAndReplay method replays if old event arrived.", () => {
		let gameState = new GameState();
		gameState.tic = 10;
		gameState.lastTicTime = 23;
		let eventQueue = {
			ticOfOldestEvent: 9,
			resetTicOfOldestEvent: jest.fn(() => {}),
		};
		let timeline = new Timeline();
		let physicsUpdater = new PhysicsUpdater();

		let testee = new Replay(
			gameState,
			eventQueue,
			timeline,
			physicsUpdater
		);

		testee.mayRevertAndReplay();

		expect(timeline.applySnapshotBeforeTic).lastCalledWith(
			eventQueue.ticOfOldestEvent
		);
		expect(physicsUpdater.update).lastCalledWith(gameState.lastTicTime);
		expect(eventQueue.resetTicOfOldestEvent).toHaveBeenCalled();
	});
});
