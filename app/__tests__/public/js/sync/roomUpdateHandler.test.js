const RoomUpdateHandler = require("../../../../public/js/sync/roomUpdateHandler");
const mocks = require("../../../mocks/mocks");
const events = require("../../../../public/js/shared/sync/events");

let socket = mocks.socket();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
});

describe("Test the RoomUpdateHandler class", () => {
	test("if init method initializes listeners.", () => {
		let testee = new RoomUpdateHandler(socket);
		testee.init();

		expect(socket.on).toHaveBeenNthCalledWith(
			1,
			events.ROOM_STATE_UPDATE,
			expect.any(Function)
		);

		expect(socket.on).toHaveBeenNthCalledWith(
			2,
			events.PLAYER_ID_ALLOCATION,
			expect.any(Function)
		);

		expect(socket.on).toHaveBeenNthCalledWith(
			3,
			events.LOAD_GAME,
			expect.any(Function)
		);
	});

	test("if _savePlayerId saves to local storage.", () => {
		let id = 0;
		localStorage = mocks.localStorage;
		let testee = new RoomUpdateHandler();
		testee._savePlayerId(id);

		expect(localStorage.setItem).toHaveBeenCalled();
	});
});
