const SyncController = require("../../../backend/sync/syncController");
const GameState = require("../../../public/js/shared/game/gameState");
const GameObject = require("../../../public/js/shared/game/gameObject");
const GameStatePublisher = require("../../../backend/sync/gameStatePublisher");
const events = require("../../../public/js/shared/sync/events");

jest.mock("../../../backend/sync/syncController");

beforeEach(() => {
	SyncController.mockClear();
});

describe("Test the GameStatePublisher class", () => {
	test("if publish method calls syncController.", () => {
		let syncController = new SyncController();
		let gameState = new GameState();
		let id = 1;
		let position = { x: 1, y: 1 };
		let gameObject = new GameObject(id, "", { position: position });
		gameState.addAll([gameObject]);
		let testee = new GameStatePublisher(syncController);

		testee.publish(gameState);

		expect(syncController.emit).lastCalledWith(events.GAME_STATE_UPDATE, [
			{
				id: id,
				position: position,
			},
		]);
	});
});
