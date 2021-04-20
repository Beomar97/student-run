const gameObjectShapes = require("../../public/js/shared/game/gameObjectShapes");
const path = require("path");
const fs = require("fs");
const { GameObject } = require("../../public/js/shared/game/gameObject");

class LevelLoader {
	constructor(levelFolder, physics) {
		this.physics = physics;
		this.levelFolder = levelFolder;
		this.levelCollection = this._loadJSONFiles();
	}

	getLevelObjectsById(levelId) {
		let level = this.levelCollection.find((x) => x.id == levelId);
		let deserializedObjects = [];
		level.gameObjects.forEach((objectDescription) => {
			deserializedObjects.push(
				this._deserializeGameObject(objectDescription)
			);
		});

		return deserializedObjects;
	}

	getLevelJSONById(levelId) {
		return this.levelCollection.find((x) => x.id == levelId);
	}

	_deserializeGameObject(objectDescription) {
		let innerObject;
		if (objectDescription.shape === gameObjectShapes.RECTANGLE) {
			innerObject = this.physics
				.getMatter()
				.Bodies.rectangle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.width,
					objectDescription.height,
					{ isStatic: objectDescription.isStatic }
				);
		} else if (objectDescription.shape === gameObjectShapes.CIRCLE) {
			innerObject = this.physics
				.getMatter()
				.Bodies.circle(
					objectDescription.x,
					objectDescription.y,
					objectDescription.radius,
					{
						isStatic: objectDescription.isStatic,
					}
				);
		}

		if (innerObject) {
			return new GameObject(
				objectDescription.id,
				objectDescription.type,
				innerObject
			);
		} else {
			throw new Error("Couldn't create all game objects.");
		}
	}

	_loadJSONFiles() {
		let levelsFolderPath = path.join(__dirname, this.levelFolder);

		let result = [];
		let files = fs.readdirSync(levelsFolderPath);
		files.forEach((file) => {
			let rawContent = fs.readFileSync(levelsFolderPath + file, "utf8");
			let go = JSON.parse(rawContent);
			result[go.id] = go;
		});

		return result;
	}
}

module.exports = LevelLoader;
