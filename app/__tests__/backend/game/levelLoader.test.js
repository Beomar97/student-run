const Matter = require("matter-js");
const LevelHolder = require("../../../backend/game/levelHolder");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const Physics = require("../../../backend/physics/physics");
const LevelLoader = require("../../../backend/game/levelLoader");
const physics = new Physics(Matter);
const testLevelPath = "../../__tests__/asset/levels/";

describe("Test the LevelHolder class", () => {
	test("if LevelHolder reads json files correctly.", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let demoLevel = testee.levelCollection;
		expect(demoLevel[0].name).toBe("Demo Level");
	});

	test("if LevelHolder generates correct types", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let demoLevelObjects = testee.getLevelObjectsById(0, physics);

		expect(demoLevelObjects[0].type).toBe(gameObjectTypes.STATIC_OBSTACLE);
		expect(demoLevelObjects[1].type).toBe(gameObjectTypes.COLLECTABLE_ITEM);
	});

	test("if LevelHolder generates correct shapes", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let demoLevelObjects = testee.getLevelObjectsById(0, physics);

		expect(demoLevelObjects[0].innerObject.label).toBe("Rectangle Body");
		expect(demoLevelObjects[1].innerObject.label).toBe("Circle Body");
	});

	test("if LevelHolder sets correct coordinates", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let demoLevelObjects = testee.getLevelObjectsById(0, physics);

		expect(demoLevelObjects[0].innerObject.position.x).toBe(0);
		expect(demoLevelObjects[0].innerObject.position.y).toBe(580);

		expect(demoLevelObjects[1].innerObject.position.x).toBe(150);
		expect(demoLevelObjects[1].innerObject.position.y).toBe(150);
	});

	test("if LevelHolder sets static property correctly", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let demoLevelObjects = testee.getLevelObjectsById(0, physics);

		expect(demoLevelObjects[0].innerObject.isStatic).toBe(true);
		expect(demoLevelObjects[1].innerObject.isStatic).toBe(false);
	});

	test("if LevelHolder returns correct json", () => {
		let levelLoader = new LevelLoader();
		let testee = new LevelHolder(testLevelPath, levelLoader);
		let json = testee.getLevelJSONById(0, physics);
		expect(json.id).toBe(0);
	});
});
