const BoostItem = require("../shared/game/boostItem");
const { GameObject } = require("../shared/game/gameObject");
const gameObjectShapes = require("../shared/game/gameObjectShapes");
const gameObjectTypes = require("../shared/game/gameObjectTypes");

class LevelInitializer {
	constructor(game) {
		this.game = game;
	}

	addJSONObjectsToPhaser(leveldata) {
		let gameObjectCollection = [];

		leveldata.gameObjects.forEach((objectDescription) => {
			let phaserObject;
			let matterObject;

			if (objectDescription.type === gameObjectTypes.FINISH_LINE) {
				phaserObject = this.game.add.sprite(
					objectDescription.x,
					objectDescription.y,
					objectDescription.texture
				);
				let uniqueCollisionCategory = this.game.matter.world.nextCategory();
				matterObject = this.game.matter.add.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					{
						isStatic: Boolean(objectDescription.isStatic),
						collisionFilter: {
							group: uniqueCollisionCategory,
							mask: 0,
						},
					}
				);
				this.game.anims.create({
					key: "finishLineAnimation",
					frames: this.game.anims.generateFrameNumbers(
						objectDescription.texture
					),
					frameRate: 10,
					repeat: -1,
				});
				phaserObject.anims.play("finishLineAnimation", true);
			} else if (
				objectDescription.type ===
				gameObjectTypes.STATIC_OBSTACLE_SPRITE
			) {
				phaserObject = this.game.add.sprite(
					objectDescription.x,
					objectDescription.y,
					objectDescription.texture
				);
				phaserObject.displayWidth = objectDescription.width;
				phaserObject.displayHeight = objectDescription.height;
				matterObject = this.game.matter.add.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					{
						isStatic: Boolean(objectDescription.isStatic),
					}
				);
				matterObject.isGroundElement = true;
			} else if (
				objectDescription.type ===
				gameObjectTypes.STATIC_OBSTACLE_TILESPRITE
			) {
				phaserObject = this.game.add.tileSprite(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					objectDescription.texture
				);
				phaserObject.displayWidth = objectDescription.width;
				phaserObject.displayHeight = objectDescription.height;
				matterObject = this.game.matter.add.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					{
						isStatic: Boolean(objectDescription.isStatic),
					}
				);
				matterObject.isGroundElement = true;
			} else if (objectDescription.shape === gameObjectShapes.RECTANGLE) {
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
				matterObject.isGroundElement = true;
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

				let gameObject = null;
				if (objectDescription.type === gameObjectTypes.BOOST_ITEM) {
					matterObject.collectableItem = true;
					gameObject = new BoostItem(
						objectDescription.id,
						matterObject
					);
				} else {
					gameObject = new GameObject(
						objectDescription.id,
						objectDescription.type,
						matterObject
					);
				}

				gameObjectCollection.push(gameObject);
			} else {
				throw new Error("Couldn't initialize all game objects.");
			}
		});

		leveldata.decorations.forEach((objectDescription) => {
			if (objectDescription.type === gameObjectTypes.DECORATION) {
				let phaserObject = this.game.add.sprite(
					objectDescription.x,
					objectDescription.y,
					objectDescription.texture
				);
				phaserObject.setScale(objectDescription.scale);
			}
		});

		return gameObjectCollection;
	}
}

module.exports = LevelInitializer;
