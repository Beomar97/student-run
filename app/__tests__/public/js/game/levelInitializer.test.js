const demoLevelJSON = require("../../../asset/levels/demo-level.json");
const mocks = require("../../../mocks/mocks");
const LevelInitializer = require("../../../../public/js/game/levelInitializer");

let phaser = mocks.phaser();

beforeEach(() => {
	mocks.util.resetPhaserMock(phaser);
});

describe("Test the LevelLoader class", () => {
	test("if LevelLoader sets client objects correctly", () => {
		let testee = new LevelInitializer(phaser);
		testee.addJSONObjectsToPhaser(demoLevelJSON);

		const platformX = 0;
		const platformY = 580;
		const platformWidth = 1600;
		const platformHeight = 20;
		const platformIsStatic = true;
		const texture = "platform2";
		expect(phaser.add.tileSprite).lastCalledWith(
			platformX,
			platformY,
			platformWidth,
			platformHeight,
			texture
		);
		expect(phaser.matter.add.rectangle).lastCalledWith(
			platformX,
			platformY,
			platformWidth,
			platformHeight,
			{
				isStatic: platformIsStatic,
			}
		);

		const starX = 150;
		const starY = 150;
		const starRadius = 20;
		const starTexture = "star";
		expect(phaser.add.sprite).lastCalledWith(starX, starY, starTexture);
		expect(phaser.matter.add.circle).lastCalledWith(
			starX,
			starY,
			starRadius
		);
	});
});
