const Physics = require("../../../backend/physics/physics");
const mocks = require("../../mocks/mocks");

let calls = [];
let matter = mocks.matter((method) => calls.push(method));

beforeEach(() => {
	calls = [];
});

describe("Test the Physics class", () => {
	test("if getMatter method returns matter", () => {
		let testee = new Physics(matter);
		expect(testee.getMatter()).toBe(matter);
	});

	test("if getEngine method returns engine", () => {
		let testee = new Physics(matter);
		expect(testee.getEngine()).toStrictEqual(matter.Engine.create());
	});

	test("if setPosition method sets position on matter.Body", () => {
		let testee = new Physics(matter);
		let object = {};
		let position = { x: 1, y: 2 };

		testee.setPosition(object, position);

		expect(calls.length).toBe(2);
		expect(calls[0]).toBe("Engine.create");
		expect(calls[1]).toBe("Body.setPosition");
	});

	test("if update method calls matter.Engine.update", () => {
		let testee = new Physics(matter);
		let time = 1;

		testee.update(time);

		expect(calls.length).toBe(2);
		expect(calls[0]).toBe("Engine.create");
		expect(calls[1]).toBe("Engine.update");
	});
});
