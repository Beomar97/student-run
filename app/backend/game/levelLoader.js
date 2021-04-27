const GameObjectBuilder = require("./gameObjectBuilder");
const gameObjectShapes = require("../../public/js/shared/game/gameObjectShapes");

class LevelLoader {
	constructor() {}

	deserializeGameObject(objectDescription, physics) {
		if (objectDescription.shape === gameObjectShapes.RECTANGLE) {
			return new GameObjectBuilder()
				.withPhysics(physics)
				.withId(objectDescription.id)
				.withGameObjectType(objectDescription.type)
				.withX(objectDescription.x)
				.withY(objectDescription.y)
				.withWidth(objectDescription.width)
				.withHeight(objectDescription.height)
				.withIsStatic(objectDescription.isStatic)
				.createRectangle();
		} else if (objectDescription.shape === gameObjectShapes.CIRCLE) {
			return new GameObjectBuilder()
				.withPhysics(physics)
				.withId(objectDescription.id)
				.withGameObjectType(objectDescription.type)
				.withX(objectDescription.x)
				.withY(objectDescription.y)
				.withRadius(objectDescription.radius)
				.withIsStatic(objectDescription.isStatic)
				.createCircle();
		}

		throw new Error("Couldn't create all game objects.");
	}
}

module.exports = LevelLoader;
