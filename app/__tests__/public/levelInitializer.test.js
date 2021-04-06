/* TODO find out how to test frontend / import frontend files
const demoLevelJSON = require("../asset/levels/demo-level.json");
const mocks = require("../mocks/mocks");
const LevelInitializer = require("../../public/js/levelInitializer");

let phaser = mocks.phaser;
*/

describe("Test the LevelLoader class", () => {
	test("nothing", () => {});

	/*
	test("if LevelLoader sets client objects correctly", () => {
		let testee = new LevelInitializer(phaser);
		let loadedObjects = testee.addJSONObjectsToPhaser(demoLevelJSON);

		expect(phaser.add.rectangle).lastCalledWith(0, 580, 1600, 20, 0x00b300);
		expect(phaser.add.sprite).lastCalledWith(150, 150, "star");

		expect(phaser.matter.add.rectangle).lastCalledWith(0, 580, 1600, 20, {
			isStatic: true,
		});
		expect(phaser.matter.add.circle).lastCalledWith(150, 150, 20);
	});
	*/
});
