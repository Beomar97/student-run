const SyncController = require("../../../backend/sync/syncController");
const Physics = require("../../../backend/physics/physics");
const EventQueue = require("../../../backend/game/eventQueue");
const GameState = require("../../../public/js/shared/game/gameState");
const ClientEventHandler = require("../../../backend/sync/clientEventHandler");
const Player = require("../../../public/js/shared/game/player");
const BoostItem = require("../../../public/js/shared/game/boostItem");
const Matter = require("matter-js");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/physics/physics");
jest.mock("../../../backend/game/eventQueue");
jest.mock("../../../public/js/shared/game/player");
jest.mock("../../../public/js/shared/game/boostItem");
jest.mock("../../../backend/logger");

beforeEach(() => {
	SyncController.mockClear();
	Physics.mockClear();
	EventQueue.mockClear();
	Player.mockClear();
});

describe("Test the ClientEventHandler class", () => {
	test("if init method calls control.", () => {
		let syncController = new SyncController();
		let testee = new ClientEventHandler(syncController, {}, {});

		testee.init();
		expect(syncController.control).toHaveBeenCalled();
	});

	test("if _handleMoveChangeEvent method calls eventQueue.", () => {
		let syncController = new SyncController();
		let eventQueue = new EventQueue();
		let movementChangeEvent = { tic: 49 };
		let testee = new ClientEventHandler(
			syncController,
			{},
			{},
			eventQueue,
			50
		);

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
		let player = new Player();
		player.id = 1;
		player.direction = {};
		gameState.addAll([player]);
		let movementChangeEvent = {
			id: player.id,
			tic: 49,
			direction: 1,
		};

		testee._applyMovementChange(movementChangeEvent);
		expect(player.setDirectionX).toHaveBeenCalledTimes(1);
	});

	test("if _applyJump method sets direction correctly.", () => {
		let gameState = new GameState();
		let physics = new Physics();
		let testee = new ClientEventHandler({}, gameState, physics);
		let player = new Player(1, {}, 0.01);
		player.direction = {};
		gameState.addAll([player]);
		let playerJumpEvent = {
			id: player.id,
			tic: 49,
			directionY: 1,
		};

		testee._applyJump(playerJumpEvent);
		expect(player.setDirectionY).toHaveBeenCalledTimes(1);
	});

	test("if _handleItemEvent method calls eventQueue.", () => {
		let syncController = new SyncController();
		let eventQueue = new EventQueue();
		let itemEvent = { tic: 49 };
		let testee = new ClientEventHandler(
			syncController,
			{},
			{},
			eventQueue,
			50
		);

		testee._handleItemEvent(itemEvent);

		expect(eventQueue.enqueue).lastCalledWith(
			itemEvent.tic,
			expect.any(Function)
		);
	});

	test("if _applyItemEffect method applys the item on the correct player", () => {
		let boostItem = new BoostItem();
		boostItem.id = 23;
		let physics = new Physics(Matter);
		let gameState = new GameState();
		let player0 = new Player();
		player0.id = 0;
		let player1 = new Player();
		player1.id = 1;
		let players = [];
		players.push(player0);
		players.push(player1);
		gameState.addAll(players);
		gameState.addAll([boostItem]);
		let syncController = new SyncController();
		let eventQueue = new EventQueue();
		let boostItemEvent = { playerId: 1, itemId: 23, tic: 49 };
		let testee = new ClientEventHandler(
			syncController,
			gameState,
			physics,
			eventQueue,
			50
		);
		testee._applyItemEffect(boostItemEvent);
		expect(player1.item).toEqual(boostItem);
	});
});
