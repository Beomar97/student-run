const Game = require("../../../backend/game/game");
const GameLoop = require("../../../backend/game/gameLoop");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");

jest.mock("../../../backend/game/gameLoop");
jest.mock("../../../backend/sync/clientEventHandler");

beforeEach(() => {
	GameLoop.mockClear();
	ClientEventHandler.mockClear();
});

describe("Test the Game class", () => {
	test("if start method inititializes the client event handler and starts the game loop.", () => {
		let gameLoop = new GameLoop();
		let clientEventHandler = new ClientEventHandler();
		let testee = new Game(gameLoop, clientEventHandler);

		testee.start();

		expect(clientEventHandler.init).toHaveBeenCalled();
		expect(gameLoop.start).toHaveBeenCalled();
	});
});
