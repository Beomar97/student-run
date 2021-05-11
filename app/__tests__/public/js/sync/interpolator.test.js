const Interpolator = require("../../../../public/js/sync/interpolator");
const mocks = require("../../../mocks/mocks");
const Player = require("../../../../public/js/shared/game/player");
const gameObjectTypes = require("../../../../public/js/shared/game/gameObjectTypes");

let matter = mocks.matter();
let phaser = mocks.phaser(3);

beforeEach(() => {
	mocks.util.resetMatterMock(matter);
	mocks.util.resetPhaserMock(phaser);
});

function createInnerGameObject(positionDiffOffset) {
	return {
		position: {
			x: 12 + positionDiffOffset,
			y: 13 + positionDiffOffset,
		},
	};
}

describe("Test the Interpolator class", () => {
	test("if interpolate method interpolates position correctly.", () => {
		let interpolationConfig = {
			maxDiff: 15,
			distanceDiffThreshold: 2,
			interpolationMaxStep: 3,
			ticDiffThreshold: 1,
		};
		let currentTic = 23;
		let updateTic = 20;

		let gameObjectUpdate = createInnerGameObject(0);
		gameObjectUpdate.id = 0;
		gameObjectUpdate.direction = { x: 0, y: 0 };

		let gameObjectThen = new Player(
			0,
			gameObjectTypes.PLAYER,
			createInnerGameObject(4),
			0,
			""
		);
		let gameObjectNow = new Player(
			0,
			gameObjectTypes.PLAYER,
			createInnerGameObject(15),
			0,
			""
		);
		let timeline = { getGameObjectAtTic: (tic) => gameObjectThen };

		let testee = new Interpolator(
			matter,
			timeline,
			phaser.math,
			interpolationConfig
		);

		testee.interpolate(
			gameObjectNow,
			gameObjectUpdate,
			currentTic,
			updateTic
		);

		expect(matter.body.setPosition).lastCalledWith(
			gameObjectNow.innerObject,
			{
				x: gameObjectNow.innerObject.position.x + 1,
				y: gameObjectNow.innerObject.position.y + 1,
			}
		);
	});
});
