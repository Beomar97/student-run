const { GameObject } = require("./shared/game/gameObject");
const gameObjectShapes = require("./shared/game/gameObjectShapes");

class LevelInitializer {
	constructor(game) {
		this.game = game;
	}

	addJSONObjectsToPhaser(leveldata) {
		let gameObjectCollection = [];

		leveldata.gameObjects.forEach((objectDescription) => {
			let phaserObject;
			let matterObject;

			if (objectDescription.shape === gameObjectShapes.RECTANGLE) {
				phaserObject = this.game.add.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					parseInt(objectDescription.fillColor)
				);
				matterObject = this.game.matter.add.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					{
						isStatic: Boolean(objectDescription.isStatic),
					}
				);
			} else if (objectDescription.shape === gameObjectShapes.CIRCLE) {
				phaserObject = this.game.add.sprite(
					objectDescription.x,
					objectDescription.y,
					objectDescription.texture
				);
				matterObject = this.game.matter.add.circle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.radius
				);
			}
			if (phaserObject && matterObject) {
				this.game.matter.add.gameObject(phaserObject, matterObject);
				gameObjectCollection.push(
					new GameObject(
						objectDescription.id,
						objectDescription,
						matterObject
					)
				);
			} else {
				throw new Error("Couldn't initialize all game objects.");
			}
		});

		return gameObjectCollection;
	}
}

module.exports = LevelInitializer;
