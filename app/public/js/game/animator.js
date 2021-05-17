const gameObjectTypes = require("../shared/game/gameObjectTypes");

class Animator {
	constructor() {
		this.playerFilter = (gameObject) =>
			gameObject.type === gameObjectTypes.PLAYER;
	}

	init(anims, playerFrameName) {
		anims.create({
			key: "left",
			frames: anims.generateFrameNumbers(playerFrameName, {
				start: 0,
				end: 3,
			}),
			frameRate: 10,
			repeat: -1,
		});

		anims.create({
			key: "turn",
			frames: [{ key: playerFrameName, frame: 4 }],
			frameRate: 20,
		});

		anims.create({
			key: "right",
			frames: anims.generateFrameNumbers(playerFrameName, {
				start: 5,
				end: 8,
			}),
			frameRate: 10,
			repeat: -1,
		});
	}

	animate(gameState) {
		gameState.forEachGameObject((player) => {
			if (player.direction.x === 1) {
				player.innerObject.gameObject.anims.play("right", true);
			} else if (player.direction.x === -1) {
				player.innerObject.gameObject.anims.play("left", true);
			} else {
				player.innerObject.gameObject.anims.play("turn", true);
			}
		}, this.playerFilter);
	}
}

module.exports = Animator;
