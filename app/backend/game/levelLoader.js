const GameObjectBuilder = require("./gameObjectBuilder");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const physicalConstant = require("../../public/js/shared/physics/physicalConstant");

class LevelLoader {
	deserializeGameObject(gameObjectDescription, physics) {
		if (gameObjectDescription.type === gameObjectTypes.FINISH_LINE) {
			gameObjectDescription.collisionCategory = physics
				.getMatter()
				.Body.nextCategory();
		}

		return new GameObjectBuilder(physics).createFromGameObjectDescription(
			gameObjectDescription
		);
	}
}

module.exports = LevelLoader;
