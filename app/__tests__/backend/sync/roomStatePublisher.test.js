const SyncController = require("../../../backend/sync/syncController");
const events = require("../../../public/js/shared/sync/events");
const RoomStatePublisher = require("../../../backend/sync/roomStatePublisher");
const Room = require("../../../backend/game/room");

jest.mock("../../../backend/sync/syncController");

beforeEach(() => {
	SyncController.mockClear();
});

describe("Test the RoomStatePublisher class", () => {
	test("if publishRoomUpdate method calls syncController.", () => {
		let syncController = new SyncController();
		let room = new Room(syncController);

		let testee = new RoomStatePublisher(syncController);

		testee.publishRoomUpdate(room);

		expect(syncController.emit).lastCalledWith(events.ROOM_STATE_UPATE, {
			waitingPlayers: "[]",
		});
	});

	test("if loadGame method calls syncController.", () => {
		let syncController = new SyncController();
		let testee = new RoomStatePublisher(syncController);

		testee.loadGame();

		expect(syncController.emit).lastCalledWith(events.LOAD_GAME);
	});

	test("if publishRoomUpdate method calls syncController.", () => {
		let socketId = "aSocketId";
		let playerId = 0;
		let syncController = new SyncController();
		let testee = new RoomStatePublisher(syncController);

		testee.publishPlayerId(socketId, playerId);

		expect(syncController.to).lastCalledWith(
			events.PLAYER_ID_ALLOCATION,
			socketId,
			playerId
		);
	});
});
