const GameScene = require("./game/GameScene");

let config = {
	type: Phaser.AUTO,
	parent: "student-run",
	width: 1000,
	height: 700,
	pixelArt: true,
	physics: {
		default: "matter",
		matter: {
			gravity: { x: 0, y: 1, scale: 0.001 },
			autoUpdate: false,
		},
		msPerTic: 1000 / 40,
	},
	scene: GameScene,
};

let customConfig = {
	skinsEnabled: false,
	interpolation: {
		maxDiff: 15,
		lowerDistanceDiffThreshold: 2,
		upperDistanceDiffThreshold: 50,
		interpolationMaxStep: 3,
		ticDiffThreshold: 2,
		ticsPerSnapshot: 4, // should be in sync with game state publish
	},
};

let game = new Phaser.Game(config);
game.config.customConfig = customConfig;
