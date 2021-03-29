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

	test("if _startMovingLeft method calls physics correctly.", () => {
		let gameState = new GameState();
		let physics = new Physics();
		let testee = new ClientEventHandler({}, gameState, physics);
		let position = { x: 1, y: 1 };
		let gameObject = new GameObject(1, "", {position: position});
		let force = { x: -0.001, y: 0 };
		gameState.addAll([gameObject]);

		testee._startMovingLeft(testee, gameObject.id, position);

		expect(physics.applyForce).lastCalledWith(
			gameObject.innerObject,
			position,
			force
		);
	});
});
