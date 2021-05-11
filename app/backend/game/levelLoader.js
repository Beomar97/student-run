const GameObjectBuilder = require("./gameObjectBuilder");
const gameObjectShapes = require("../../public/js/shared/game/gameObjectShapes");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");

class LevelLoader {
	deserializeGameObject(objectDescription, physics) {
		let gameObjectBuilder = new GameObjectBuilder(physics)
			.withShape(objectDescription.shape)
			.withId(objectDescription.id)
			.withGameObjectType(objectDescription.type)
			.withX(objectDescription.x)
			.withY(objectDescription.y)
			.withIsStatic(objectDescription.isStatic);

		switch (objectDescription.shape) {
			case gameObjectShapes.RECTANGLE:
				gameObjectBuilder
					.withWidth(objectDescription.width)
					.withHeight(objectDescription.height);
				if (objectDescription.type === gameObjectTypes.FINISH_LINE) {
					let uniqueCollisionCategory = physics
						.getMatter()
						.Body.nextCategory();
					gameObjectBuilder.withCollisionCategory(
						uniqueCollisionCategory
					);
				}
				break;
			case gameObjectShapes.CIRCLE:
				gameObjectBuilder.withRadius(objectDescription.radius);
				break;
			default:
				throw new Error("Couldn't create all game objects.");
		}

		return gameObjectBuilder.create();
	}
}

module.exports = LevelLoader;
