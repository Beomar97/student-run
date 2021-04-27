const Matter = require("matter-js");
const GameObjectBuilder = require("../../../backend/game/gameObjectBuilder");
const Physics = require("../../../backend/physics/physics");

describe("Test the GameObjectBuilder class", () => {
	test("if create method creates rectangle correctly.", () => {
		let physics = new Physics(Matter);
		let id = 0;
		let type = "rectangle";
		let x = 0;
		let y = 0;
		let width = 0;
		let height = 0;
		let isStatic = true;

		let testee = new GameObjectBuilder();
		let rectangleGameObject = testee
			.withPhysics(physics)
			.withId(id)
			.withGameObjectType(type)
			.withX(x)
			.withY(y)
			.withWidth(width)
			.withHeight(height)
			.withIsStatic(isStatic)
			.createRectangle();

		expect(rectangleGameObject.id).toBe(id);
		expect(rectangleGameObject.type).toBe(type);
		expect(rectangleGameObject.innerObject.position.x).toBe(x);
		expect(rectangleGameObject.innerObject.position.y).toBe(y);
	});

	test("if create method creates circle correctly.", () => {
		let physics = new Physics(Matter);
		let id = 0;
		let type = "rectangle";
		let x = 0;
		let y = 0;
		let radius = 1;
		let isStatic = true;

		let testee = new GameObjectBuilder();
		let rectangleGameObject = testee
			.withPhysics(physics)
			.withId(id)
			.withGameObjectType(type)
			.withX(x)
			.withY(y)
			.withRadius(radius)
			.withIsStatic(isStatic)
			.createCircle();

		expect(rectangleGameObject.id).toBe(id);
		expect(rectangleGameObject.type).toBe(type);
		expect(rectangleGameObject.innerObject.position.x).toBe(x);
		expect(rectangleGameObject.innerObject.position.y).toBe(y);
	});

	test("if create method throws error if mandatory attribute is not set.", () => {
		let physics = new Physics(Matter);
		let id = 0;
		let type = "rectangle";
		let x = 0;
		let y = 0;
		let radius = 1;
		let isStatic = true;

		let testee = new GameObjectBuilder();
		let rectangleGameObject = testee
			.withPhysics(physics)
			.withId(id)
			.withGameObjectType(type)
			.withX(x)
			.withY(y)
			.withIsStatic(isStatic);

		expect(() => testee.createRectangle()).toThrow(
			"Cannot create rectangle game object. Values are missing"
		);
	});

	test("if create rectangle method throws error if mandatory attribute is not set.", () => {
		let width = 0;
		let height = 0;
		let isStatic = true;

		let testee = new GameObjectBuilder();
		let rectangleGameObject = testee
			.withWidth(width)
			.withHeight(height)
			.withIsStatic(isStatic);

		expect(() => testee.createRectangle()).toThrow(
			"Cannot create game object. Values are missing"
		);
	});

	test("if create rectangle method throws error if mandatory attribute is not set.", () => {
		let isStatic = true;

		let testee = new GameObjectBuilder();
		let rectangleGameObject = testee.withIsStatic(isStatic);

		expect(() => testee.createCircle()).toThrow(
			"Cannot create game object. Values are missing"
		);
	});
});
