const SyncController = require("../../../backend/sync/syncController");
const RoomEventHandler = require("../../../backend/sync/roomEventHandler");
const Room = require("../../../backend/game/room");

jest.mock("../../../backend/sync/syncController");
jest.mock("../../../backend/game/room");

beforeEach(() => {
	SyncController.mockClear();
	Room.mockClear();
});

describe("Test the RoomEventHandler class", () => {
	test("if init method calls control.", () => {
		let syncController = new SyncController();
		let testee = new RoomEventHandler(syncController, {});

		testee.init();
		expect(syncController.control).toHaveBeenCalled();
	});

	test("if _handlePlayerJoinedEvent calls addPlayer.", () => {
		let syncController = new SyncController();
		let room = new Room(syncController);
		let socketId = "aSocketId";
		let newPlayer = {};

		let testee = new RoomEventHandler(syncController, room);
		testee._handlePlayerJoinedEvent(socketId, newPlayer);

		expect(room.addPlayer).toHaveBeenCalledWith(socketId, newPlayer);
	});

	test("if _handleInitializeGame calls initializeGame.", () => {
		let syncController = new SyncController();
		let room = new Room(syncController);

		let testee = new RoomEventHandler(syncController, room);
		testee._handleInitializeGame();

		expect(room.initializeGame).toHaveBeenCalled();
	});
});
