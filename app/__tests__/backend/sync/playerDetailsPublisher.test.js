const SyncController = require("../../../backend/sync/syncController");
const GameState = require("../../../public/js/shared/game/gameState");
const Player = require("../../../public/js/shared/game/player");
const PlayerDetailsPublisher = require("../../../backend/sync/playerDetailsPublisher");
const events = require("../../../public/js/shared/sync/events");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");

jest.mock("../../../backend/sync/syncController");

beforeEach(() => {
	SyncController.mockClear();
});

describe("Test the PlayerDetailsPublisher class", () => {
	test("if publish method calls syncController.", () => {
		let syncController = new SyncController();
		let gameState = new GameState();
		let id = 1;
		let player = new Player(id, { position: {} });
		gameState.addAll([player]);
		let testee = new PlayerDetailsPublisher(syncController);

		testee.publish(gameState);

		expect(syncController.emit).lastCalledWith(
			events.PLAYER_DETAILS_UPDATE,
			[
				{
					id: 1,
					done: false,
					doneAt: null,
				},
			]
		);
	});
});
