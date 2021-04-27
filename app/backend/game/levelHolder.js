const path = require("path");
const fs = require("fs");

class LevelHolder {
	constructor(levelFolder, levelLoader) {
		this.levelFolder = levelFolder;
		this.levelLoader = levelLoader;
		this.levelCollection = this._loadJSONFiles();
	}

	getLevelObjectsById(levelId, physics) {
		let level = this.levelCollection.find((x) => x.id == levelId);
		let deserializedObjects = [];
		level.gameObjects.forEach((objectDescription) => {
			deserializedObjects.push(
				this.levelLoader.deserializeGameObject(
					objectDescription,
					physics
				)
			);
		});

		return deserializedObjects;
	}

	getLevelJSONById(levelId) {
		return this.levelCollection.find((x) => x.id == levelId);
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

module.exports = LevelHolder;
