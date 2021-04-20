const Physics = require("../../../backend/physics/physics");
const mocks = require("../../mocks/mocks");

let matter = mocks.matter();

beforeEach(() => {
	mocks.util.resetMatterMock(matter);
});

describe("Test the Physics class", () => {
	test("if getMatter method returns matter", () => {
		let testee = new Physics(matter);
		expect(testee.getMatter()).toBe(matter);
	});

	test("if getEngine method returns engine", () => {
		let testee = new Physics(matter);
		let expectee = matter.Engine.create();
		expectee.world.gravity = { x: 0, y: 1, scale: 0.001 };
		expect(testee.getEngine()).toStrictEqual(expectee);
	});

	test("if setPosition method sets position on matter.Body", () => {
		let testee = new Physics(matter);
		let object = {};
		let position = { x: 1, y: 2 };

		testee.setPosition(object, position);

		expect(matter.Engine.create).toHaveBeenCalled();
		expect(matter.Body.setPosition).lastCalledWith(object, position);
	});

	test("if update method calls matter.Engine.update", () => {
		let testee = new Physics(matter);
		let time = 1;

		testee.update(time);

		expect(matter.Engine.create).toHaveBeenCalled();
		expect(matter.Engine.update).lastCalledWith(testee.getEngine(), time);
	});
});
