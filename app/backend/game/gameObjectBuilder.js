const {
	GameObject,
	Player,
} = require("../../public/js/shared/game/gameObject");

class GameObjectBuilder {
	constructor() {
		this.properties = {};
		this.properties.collisionFilter = {
			category: 1,
			mask: -1,
		};
		this.physics = null;
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

	withPhysics(physics) {
		this.physics = physics;
		return this;
	}

	withCollisionCategory(collisionCategory) {
		this.properties.collisionFilter = {
			collisionFilter: collisionCategory,
			mask: 0,
		};
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

	_validateBase() {
		let isNotValid =
			this.properties.x === undefined ||
			this.properties.y === undefined ||
			this.properties.isStatic === undefined ||
			this.properties.gameObjectType === undefined ||
			this.properties.id === undefined ||
			this.physics === undefined;

		if (isNotValid) {
			throw new Error("Cannot create game object. Values are missing.");
		}
	}

	_validateRectangle() {
		let isNotValid =
			this.properties.width === undefined ||
			this.properties.height === undefined;

		if (isNotValid) {
			throw new Error(
				"Cannot create rectangle game object. Values are missing."
			);
		}
	}

	_validateCircle() {
		let isNotValid = !this.properties.radius;

		if (isNotValid) {
			throw new Error(
				"Cannot create circle game object. Values are missing."
			);
		}
	}
}

module.exports = GameObjectBuilder;
