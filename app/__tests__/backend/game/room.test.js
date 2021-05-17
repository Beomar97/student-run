const SyncController = require("../../../backend/sync/syncController");
const Room = require("../../../backend/game/room");

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
});
