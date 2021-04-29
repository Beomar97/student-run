const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const physicalConstant = require("../../public/js/shared/physics/physicalConstant");
const {
	GameObject,
	Player,
} = require("../../public/js/shared/game/gameObject");

class GameObjectBuilder {
	constructor(physics) {
		this.properties = {};
		this.properties.collisionFilter = {
			category: 1,
			mask: -1,
		};
		this.physics = physics;
	}

	withId(id) {
		this.properties.id = id;
		return this;
	}

	withGameObjectType(gameObjectType) {
		this.properties.gameObjectType = gameObjectType;
		return this;
	}

	withX(x) {
		this.properties.x = x;
		return this;
	}

	withY(y) {
		this.properties.y = y;
		return this;
	}

	withWidth(width) {
		this.properties.width = width;
		return this;
	}

	withHeight(height) {
		this.properties.height = height;
		return this;
	}

	withRadius(radius) {
		this.properties.radius = radius;
		return this;
	}

	withIsStatic(isStatic) {
		this.properties.isStatic = isStatic;
		return this;
	}

	withCollisionCategory(collisionCategory) {
		this.properties.collisionFilter = {
			collisionFilter: collisionCategory,
			mask: 0,
		};
		return this;
	}

	withName(name) {
		this.properties.name = name;
		return this;
	}

	createRectangle() {
		this._validateBase();
		this._validateRectangle();

		let innerObject = this.physics
			.getMatter()
			.Bodies.rectangle(
				this.properties.x,
				this.properties.y,
				this.properties.width,
				this.properties.height,
				{
					isStatic: this.properties.isStatic,
					collisionFilter: this.properties.collisionFilter,
				}
			);

		return new GameObject(
			this.properties.id,
			this.properties.gameObjectType,
			innerObject
		);
	}

	createCircle() {
		this._validateBase();
		this._validateCircle();

		let innerObject = this.physics
			.getMatter()
			.Bodies.circle(
				this.properties.x,
				this.properties.y,
				this.properties.radius,
				{
					isStatic: this.properties.isStatic,
				}
			);

		return new GameObject(
			this.properties.id,
			this.properties.gameObjectType,
			innerObject
		);
	}

	createPlayer() {
		this._validatePlayer();

		let innerObject = this.physics
			.getMatter()
			.Bodies.circle(
				physicalConstant.PLAYER_SPAWN_X,
				physicalConstant.PLAYER_SPAWN_Y,
				physicalConstant.PLAYER_SIZE,
				{
					frictionAir: physicalConstant.FRICTION_AIR,
				}
			);

		return new Player(
			this.properties.id,
			gameObjectTypes.PLAYER,
			innerObject,
			physicalConstant.BASE_FORCE,
			this.properties.name
		);
	}

	_validateBase() {
		let isNotValid =
			this.properties.x == null ||
			this.properties.y == null ||
			this.properties.gameObjectType == null ||
			this.properties.id == null ||
			this.physics == null;

		if (isNotValid) {
			throw new Error("Cannot create game object. Values are missing.");
		}
	}

	_validateRectangle() {
		let isNotValid =
			this.properties.isStatic == null ||
			this.properties.width == null ||
			this.properties.height == null;

		if (isNotValid) {
			throw new Error(
				"Cannot create rectangle game object. Values are missing."
			);
		}
	}

	_validateCircle() {
		let isNotValid = this.properties.radius == null;

		if (isNotValid) {
			throw new Error(
				"Cannot create circle game object. Values are missing."
			);
		}
	}

	_validatePlayer() {
		let isNotValid = this.properties.name == null;

		if (isNotValid) {
			throw new Error(
				"Cannot create player game object. Values are missing."
			);
		}
	}
}

module.exports = GameObjectBuilder;
