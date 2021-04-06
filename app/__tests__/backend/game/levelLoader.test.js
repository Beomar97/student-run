const Matter = require("matter-js");
const LevelLoader = require("../../../backend/game/levelLoader");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const Physics = require("../../../backend/physics/physics");
const physics = new Physics(Matter);
const testLevelPath = "../../__tests__/asset/levels/";

describe("Test the LevelLoader class", () => {
	test("if LevelLoader reads json files correctly.", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let demoLevel = testee.levelCollection;
		expect(demoLevel[0].name).toBe("Demo Level");
	});

	test("if LevelLoader generates correct types", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let demoLevelObjects = testee.getLevelObjectsById(0);

		expect(demoLevelObjects[0].type).toBe(gameObjectTypes.STATIC_OBSTACLE);
		expect(demoLevelObjects[1].type).toBe(gameObjectTypes.COLLECTABLE_ITEM);
	});

	test("if LevelLoader generates correct shapes", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let demoLevelObjects = testee.getLevelObjectsById(0);

		expect(demoLevelObjects[0].innerObject.label).toBe("Rectangle Body");
		expect(demoLevelObjects[1].innerObject.label).toBe("Circle Body");
	});

	test("if LevelLoader sets correct coordinates", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let demoLevelObjects = testee.getLevelObjectsById(0);

		expect(demoLevelObjects[0].innerObject.position.x).toBe(0);
		expect(demoLevelObjects[0].innerObject.position.y).toBe(580);

		expect(demoLevelObjects[1].innerObject.position.x).toBe(150);
		expect(demoLevelObjects[1].innerObject.position.y).toBe(150);
	});

	test("if LevelLoader sets static property correctly", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let demoLevelObjects = testee.getLevelObjectsById(0);

		expect(demoLevelObjects[0].innerObject.isStatic).toBe(true);
		expect(demoLevelObjects[1].innerObject.isStatic).toBe(false);
	});

	test("if LevelLoader returns correct json", () => {
		let testee = new LevelLoader(testLevelPath, physics);
		let json = testee.getLevelJSONById(0);
		expect(json.id).toBe(0);
	});
});
