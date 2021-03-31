/* TODO find out how to test frontend / import frontend files

require("../../../../public/js/sync/clientSync");
const mocks = require("../../../mocks/mocks");

let socket = mocks.socket();

beforeEach(() => {
	mocks.util.resetSocketMock(socket);
});
*/

describe("Test the ClientSync class", () => {
	test("nothing", () => {});
	/*
	test("if on method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ClientSync(socket);

		testee.on(event, object);

		expect(socket.on).lastCalledWith(event, object);
	});

	test("if emit method calls socket.", () => {
		let event = "event";
		let object = {};
		let testee = new ClientSync(socket);

		testee.emit(event, object);

		expect(socket.emit).lastCalledWith(event, object);
	});*/
});
