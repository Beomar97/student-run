const GameFactory = require("../../../backend/game/gameFactory");
const { GameObject } = require("../../../public/js/shared/game/gameObject");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const SyncController = require("../../../backend/sync/syncController");
const FinishLineWatcher = require("../../../backend/rules/finishLineWatcher");
const Physics = require("../../../backend/physics/physics");
const Room = require("../../../backend/game/room");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/physics/physics");
jest.mock("../../../backend/rules/finishLineWatcher");
jest.mock("../../../backend/game/room");

beforeEach(() => {
	SyncController.mockClear();
	Physics.mockClear();
	FinishLineWatcher.mockClear();
});

describe("Test the GameFactory class", () => {
	test("if create method creates game correctly.", () => {
		let milisPerTic = 1000 / 40;
		let ticsPerPublish = 4;
		let maxSnapshots = 10;
		let ticsPerSnapshot = 8;
		let maxEntriesEventQueue = 80;
		let allowedEventMaxAge = 70;
		let syncController = new SyncController();
		let room = new Room(syncController);
		let physics = new Physics();
		let gameObjectId = 1;
		let gameObjects = [
			new GameObject(gameObjectId, gameObjectTypes.FINISH_LINE, {
				id: 0,
			}),
		];

		let testee = new GameFactory();
		let game = testee
			.withMilisPerTic(milisPerTic)
			.withTicsPerPublish(ticsPerPublish)
			.withMaxSnapshots(maxSnapshots)
			.withTicsPerSnapshot(ticsPerSnapshot)
			.withMaxEntriesEventQueue(maxEntriesEventQueue)
			.withAllowedEventMaxAge(allowedEventMaxAge)
			.withSyncController(syncController)
			.inRoom(room)
			.withPhysics(physics)
			.withGameObjects(gameObjects)
			.create();

		expect(game.clientEventHandler.syncController).toBe(syncController);
		expect(game.clientEventHandler.physics).toBe(physics);
		expect(game.gameLoop.milisPerTic).toBe(milisPerTic);
		expect(game.gameLoop.gameStatePublisher.ticsPerPublish).toBe(
			ticsPerPublish
		);
		expect(game.gameLoop.gameUpdate.timeline.maxSnapshots).toBe(
			maxSnapshots
		);
		expect(game.gameLoop.gameUpdate.timeline.ticsPerSnapshot).toBe(
			ticsPerSnapshot
		);
		expect(game.gameLoop.gameUpdate.eventQueue.maxEntries).toBe(
			maxEntriesEventQueue
		);
		expect(game.clientEventHandler.eventMaxAge).toBe(allowedEventMaxAge);
		expect(game.gameLoop.gameState.getGameObject(gameObjectId)).toBe(
			gameObjects[0]
		);
	});

	test("if create method throws error if mandatory attribute is not set.", () => {
		let milisPerTic = 1000 / 40;
		let physics = new Physics();
		let gameObjectId = 1;
		let gameObjects = [new GameObject(gameObjectId)];

		let testee = new GameFactory()
			.withMilisPerTic(milisPerTic)
			.withPhysics(physics)
			.withGameObjects(gameObjects);

		expect(() => testee.create()).toThrow(
			"Cannot create game. Values are missing."
		);
	});
});
