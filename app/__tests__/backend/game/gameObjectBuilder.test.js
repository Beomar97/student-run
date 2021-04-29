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
		let collision = {
			category: 1,
			mask: -1,
		};

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee
			.withId(id)
			.withGameObjectType(type)
			.withX(x)
			.withY(y)
			.withWidth(width)
			.withHeight(height)
			.withIsStatic(isStatic)
			.withCollisionCategory(collision)
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

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee
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

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee
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
		let physics = new Physics(Matter);
		let width = 0;
		let isStatic = true;

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee
			.withWidth(width)
			.withIsStatic(isStatic);

		expect(() => testee.createRectangle()).toThrow(
			"Cannot create game object. Values are missing"
		);
	});

	test("if create circle method throws error if mandatory attribute is not set.", () => {
		let physics = new Physics(Matter);
		let id = 0;
		let type = "rectangle";
		let x = 0;
		let y = 0;
		let isStatic = true;

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee
			.withId(id)
			.withGameObjectType(type)
			.withX(x)
			.withY(y)
			.withIsStatic(isStatic);

		expect(() => testee.createCircle()).toThrow(
			"Cannot create circle game object. Values are missing."
		);
	});

	test("if create player method throws error if mandatory attribute is not set.", () => {
		let physics = new Physics(Matter);
		let id = 0;
		let name = "hans";

		let testee = new GameObjectBuilder(physics);
		let rectangleGameObject = testee.withId(id);

		expect(() => testee.createPlayer()).toThrow(
			"Cannot create player game object. Values are missing."
		);
	});
});
