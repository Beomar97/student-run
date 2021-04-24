const SyncController = require("../../../backend/sync/syncController");
const Physics = require("../../../backend/physics/physics");
const EventQueue = require("../../../backend/game/eventQueue");
const GameState = require("../../../public/js/shared/game/gameState");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");
const { Player } = require("../../../public/js/shared/game/gameObject");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/physics/physics");
jest.mock("../../../backend/game/eventQueue");

beforeEach(() => {
	SyncController.mockClear();
	Physics.mockClear();
	EventQueue.mockClear();
});

describe("Test the ClientEventHandler class", () => {
	test("if init method calls control.", () => {
		let syncController = new SyncController();
		let testee = new ClientEventHandler(syncController, {}, {});

		testee.init();
		expect(syncController.control).toHaveBeenCalled();
	});

	test("if _handleMoveChangeEvent method calls eventQueue.", () => {
		let eventQueue = new EventQueue();
		let movementChangeEvent = { tic: 49 };
		let testee = new ClientEventHandler({}, {}, {}, eventQueue, 50);

		testee._handleMoveChangeEvent(movementChangeEvent);

		expect(eventQueue.enqueue).lastCalledWith(
			movementChangeEvent.tic,
			expect.any(Function)
		);
	});

	test("if _applyMovementChange method sets direction correctly.", () => {
		let gameState = new GameState();
		let physics = new Physics();
		let testee = new ClientEventHandler({}, gameState, physics);
		let player = new Player(1, "", {}, 0.01);
		gameState.addAll([player]);
		let movementChangeEvent = {
			id: player.id,
			tic: 49,
			direction: { x: 1, y: 1 },
		};

		testee._applyMovementChange(movementChangeEvent);

		expect(player.direction).toStrictEqual(movementChangeEvent.direction);
	});
});
