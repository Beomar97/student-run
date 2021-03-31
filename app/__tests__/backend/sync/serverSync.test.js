const ServerSync = require("../../../backend/sync/serverSync");
const mocks = require("../../mocks/mocks");

let socket = mocks.socket();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
});

describe("Test the ServerSync class", () => {
	test("if id method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ServerSync(socket);

		expect(testee.getId()).toBe(socket.id);
	});

	test("if on method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ServerSync(socket);

		testee.on(event, object);

		expect(socket.on).lastCalledWith(event, object);
	});

	test("if emit method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ServerSync(socket);

		testee.emit(event, object);

		expect(socket.emit).lastCalledWith(event, object);
	});

	test("if emitAll method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ServerSync(socket);

		testee.emitAll(event, object);

		expect(socket.broadcast.emit).lastCalledWith(event, object);
	});
});
