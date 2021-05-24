const BoostItem = require("../shared/game/boostItem");
const { GameObject } = require("../shared/game/gameObject");
const gameObjectTypes = require("../shared/game/gameObjectTypes");
const textureStyles = require("../view/textureStyle");

class LevelInitializer {
	constructor(game) {
		this.game = game;
	}

	addJSONObjectsToPhaser(leveldata) {
		let gameObjects = this._createGameObjects(leveldata);
		this._createDecorations(leveldata);
		return gameObjects;
	}

	_createDecorations(leveldata) {
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
	}

	_createGameObjects(leveldata) {
		let gameObjects = [];
		leveldata.gameObjects.forEach((objectDescription) => {
			let matterObject = this._createMatterObject(objectDescription);
			let phaserObject = this._createPhaserObject(objectDescription);

			if (phaserObject && matterObject) {
				this.game.matter.add.gameObject(phaserObject, matterObject);

				let gameObject = null;
				if (objectDescription.type === gameObjectTypes.BOOST_ITEM) {
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

				gameObjects.push(gameObject);
			} else {
				throw new Error("Couldn't initialize all game objects.");
			}
		});
		return gameObjects;
	}

	_createPhaserObject(objectDescription) {
		let phaserObject;

		if (objectDescription.textureStyle === textureStyles.SPRITE) {
			phaserObject = this.game.add.sprite(
				objectDescription.x,
				objectDescription.y,
				objectDescription.texture
			);
		} else if (
			objectDescription.textureStyle == textureStyles.TILE_SPRITE
		) {
			phaserObject = this.game.add.tileSprite(
				objectDescription.x,
				objectDescription.y,
				objectDescription.width,
				objectDescription.height,
				objectDescription.texture
			);
		} else {
			throw new Error(
				"textureStyle not defined. Object: " +
					JSON.stringify(objectDescription)
			);
		}

		if (objectDescription.width && objectDescription.height) {
			phaserObject.displayWidth = objectDescription.width;
			phaserObject.displayHeight = objectDescription.height;
		}

		return phaserObject;
	}

	_createMatterObject(objectDescription) {
		let matterObject;

		if (objectDescription.type === gameObjectTypes.FINISH_LINE) {
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
		} else if (objectDescription.type === gameObjectTypes.STATIC_OBSTACLE) {
			matterObject = this.game.matter.add.rectangle(
				objectDescription.x,
				objectDescription.y,
				objectDescription.width,
				objectDescription.height,
				{
					isStatic: Boolean(objectDescription.isStatic),
				}
			);
		} else if (objectDescription.type === gameObjectTypes.BOOST_ITEM) {
			matterObject = this.game.matter.add.circle(
				objectDescription.x,
				objectDescription.y,
				objectDescription.radius
			);
		}

		return matterObject;
	}
}

module.exports = LevelInitializer;
