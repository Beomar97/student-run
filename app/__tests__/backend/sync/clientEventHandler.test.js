const SyncController = require("../../../backend/sync/syncController");
const Physics = require("../../../backend/physics/physics");
const GameState = require("../../../public/js/shared/game/gameState");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");
const events = require("../../../public/js/shared/sync/events");
const GameObject = require("../../../public/js/shared/game/gameObject");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/physics/physics");

beforeEach(() => {
	SyncController.mockClear();
	Physics.mockClear();
});

describe("Test the ClientEventHandler class", () => {
	test("if init method calls conrtol.", () => {
		let syncController = new SyncController();
		let testee = new ClientEventHandler(syncController, {}, {});

		testee.init();
		expect(syncController.control).toHaveBeenCalled();
	});

	test("if _startMoving method calls physics correctly.", () => {
		let gameState = new GameState();
		let physics = new Physics();
		let testee = new ClientEventHandler({}, gameState, physics);
		let gameObject = new GameObject(1, "", {});
		let position = { x: 1, y: 1 };
		gameState.addAll([gameObject]);

		testee._startMoving(testee, gameObject.id, position);

		expect(physics.setPosition).lastCalledWith(
			gameObject.innerObject,
			position
		);
	});
});
