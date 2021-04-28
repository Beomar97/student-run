const Game = require("../../../backend/game/game");
const GameLoop = require("../../../backend/game/gameLoop");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");
const SyncController = require("../../../backend/sync/syncController");
const events = require("../../../public/js/shared/sync/events");
const mocks = require("../../mocks/mocks");

jest.mock("../../../backend/game/gameLoop");
jest.mock("../../../backend/sync/clientEventHandler");
jest.mock("../../../backend/sync/syncController");

beforeEach(() => {
	GameLoop.mockClear();
	ClientEventHandler.mockClear();
	SyncController.mockClear();
});

describe("Test the Game class", () => {
	test("if start method inititializes the client event handler and starts listening on connection event to start game.", () => {
		let gameLoop = new GameLoop();
		let clientEventHandler = new ClientEventHandler();
		let syncController = new SyncController();
		let testee = new Game(gameLoop, clientEventHandler, syncController);

		testee.start();

		expect(clientEventHandler.init).toHaveBeenCalled();
		expect(gameLoop.start).toHaveBeenCalled();
		expect(syncController.emit).lastCalledWith(
			events.GAME_START,
			expect.any(Number)
		);
	});
});
