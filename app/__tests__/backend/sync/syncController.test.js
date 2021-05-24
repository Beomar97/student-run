const SyncController = require("../../../backend/sync/syncController");
const events = require("../../../public/js/shared/sync/events");
const mocks = require("../../mocks/mocks");

let socket = mocks.socket();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
});

describe("Test the ServerSync class", () => {
	test("if control method calls socket.", () => {
		let f = (socket) => {};
		let testee = new SyncController(socket);

		let callerName = "callerName";
		testee.control(f, callerName);

		expect(testee.onConnections.get(callerName)).toEqual(f);
	});

	test("if init method calls socket.", () => {
		let f = (socket) => {};
		let testee = new SyncController(socket);

		testee.init();

		expect(socket.on).lastCalledWith(
			events.CONNECTION,
			expect.any(Function)
		);
	});

	test("if emit method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new SyncController(socket);

		testee.emit(event, object);

		expect(socket.emit).lastCalledWith(event, object);
	});

	test("if to method calls socket.", () => {
		let client = "asdf";
		let event = "event";
		let object = {};
		let testee = new SyncController(socket);

		testee.to(client, event, object);

		expect(socket.to).lastCalledWith(event);
	});
});
