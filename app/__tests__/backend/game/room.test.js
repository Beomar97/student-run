const Matter = require("matter-js");
const SyncController = require("../../../backend/sync/syncController");
const Room = require("../../../backend/game/room");
const GameObjectBuilder = require("../../../backend/game/gameObjectBuilder");
const Physics = require("../../../backend/physics/physics");

jest.mock("../../../backend/sync/syncController");

beforeEach(() => {
	SyncController.mockClear();
});

describe("Test the Room class", () => {
	test("If players can be added", () => {
		let syncController = new SyncController();
		let testee = new Room(syncController);

		let socketId = "asdf";
		let playerName = "mustermann";

		testee.addPlayer(socketId, playerName);
		expect(syncController.emit).toHaveBeenCalled();
	});

	test("If game can be started", () => {
		let syncController = new SyncController();
		let testee = new Room(syncController);

		testee.initializeGame();
		expect(syncController.emit).toHaveBeenCalled();
	});

	test("If game can be stoped", () => {
		let syncController = new SyncController();
		let testee = new Room(syncController);

		testee.initializeGame();
		testee.stopGame();
		expect(testee.roomLocked).toBe(false);
	});

	test("If game is started when every one is ready", () => {
		let syncController = new SyncController();
		let testee = new Room(syncController);
		testee.game = { start: jest.fn(() => {}) };
		testee.addPlayer("a", { name: "a" });
		testee.playerReady(0);
		expect(testee._allPlayersReady()).toBe(true);
	});

	test("If _getPlayerObjects returns gameObjectCollection", () => {
		let syncController = new SyncController();
		let physics = new Physics(Matter);
		let gameObjectBuilder = new GameObjectBuilder(physics);
		let testee = new Room(syncController);
		testee.addPlayer("a", { name: "a" });
		expect(testee._getPlayerObjects(gameObjectBuilder)).toBeTruthy();
	});
});
