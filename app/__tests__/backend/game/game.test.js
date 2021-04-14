const Game = require("../../../backend/game/game");
const GameLoop = require("../../../backend/game/gameLoop");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");
const SyncController = require("../../../backend/sync/syncController");
const events = require("../../../public/js/shared/sync/events");
const mocks = require("../../mocks/mocks");

jest.mock("../../../backend/game/gameLoop");
jest.mock("../../../backend/sync/clientEventHandler");

let socket = mocks.socket();

beforeEach(() => {
	GameLoop.mockClear();
	ClientEventHandler.mockClear();
	mocks.util.resetSocketMock(socket);
});

describe("Test the Game class", () => {
	test("if start method inititializes the client event handler and starts listening on connection event to start game.", () => {
		let gameLoop = new GameLoop();
		let clientEventHandler = new ClientEventHandler();
		let testee = new Game(
			gameLoop,
			clientEventHandler,
			new SyncController(socket)
		);

		testee.start();

		expect(clientEventHandler.init).toHaveBeenCalled();
		expect(socket.on).lastCalledWith(
			events.CONNECTION,
			expect.any(Function)
		);
	});
});
