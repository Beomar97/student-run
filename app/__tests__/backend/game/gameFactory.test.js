const GameFactory = require("../../../backend/game/gameFactory");
const { GameObject } = require("../../../public/js/shared/game/gameObject");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const SyncController = require("../../../backend/sync/syncController");
const FinishLineWatcher = require("../../../backend/rules/finishLineWatcher");
const Physics = require("../../../backend/physics/physics");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/physics/physics");
jest.mock("../../../backend/rules/finishLineWatcher");

beforeEach(() => {
	SyncController.mockClear();
	Physics.mockClear();
	FinishLineWatcher.mockClear();
});

describe("Test the GameFactory class", () => {
	test("if create method creates game correctly.", () => {
		let milisPerTick = 1000 / 40;
		let syncController = new SyncController();
		let physics = new Physics();
		let gameObjectId = 1;
		let gameObjects = [
			new GameObject(gameObjectId, gameObjectTypes.FINISH_LINE),
		];

		let testee = new GameFactory();
		let game = testee
			.withMilisPerTick(milisPerTick)
			.withSyncController(syncController)
			.withPhysics(physics)
			.withGameObjects(gameObjects)
			.create();

		expect(game.clientEventHandler.syncController).toBe(syncController);
		expect(game.clientEventHandler.physics).toBe(physics);
		expect(game.gameLoop.milisPerTick).toBe(milisPerTick);
		expect(game.gameLoop.gameState.getGameObject(gameObjectId)).toBe(
			gameObjects[0]
		);
	});

	test("if create method throws error if mandatory attribute is not set.", () => {
		let milisPerTick = 1000 / 40;
		let physics = new Physics();
		let gameObjectId = 1;
		let gameObjects = [new GameObject(gameObjectId)];

		let testee = new GameFactory()
			.withMilisPerTick(milisPerTick)
			.withPhysics(physics)
			.withGameObjects(gameObjects);

		expect(() => testee.create()).toThrow(
			"Cannot create game. Values are missing."
		);
	});
});
