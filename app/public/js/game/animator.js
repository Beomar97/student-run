const gameObjectTypes = require("../shared/game/gameObjectTypes");
const Skins = require("./skins");

class Animator {
	constructor() {
		this.playerFilter = (gameObject) =>
			gameObject.type === gameObjectTypes.PLAYER;

	}
	
	init(anims) {
		Skins.getSkins().forEach((skin) => {
			skin.anims.forEach((anim) => {
				let frames;
				if (typeof(anim.frames) === 'number') {
					frames = [{ key: skin.name, frame: anim.frames }]
				} else {
					frames = anims.generateFrameNumbers(skin.name, anim.frames)
				}
				anims.create({
					key: anim.name + skin.name,
					frames: frames,
					frameRate: 10,
					repeat: -1,
				});
			})
		})
	}

	animate(gameState) {
		gameState.forEachGameObject((player) => {
			if (player.direction.x === 1) {
				player.innerObject.gameObject.anims.play("right" + player.skin.name, true);
			} else if (player.direction.x === -1) {
				player.innerObject.gameObject.anims.play("left" + player.skin.name, true);
			} else {
				player.innerObject.gameObject.anims.play("turn" + player.skin.name, true);
			}
		}, this.playerFilter);
	}
}

module.exports = Animator;
