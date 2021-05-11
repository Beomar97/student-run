const BoostItem = require("../../public/js/shared/game/boostItem");
const { GameObject } = require("../../public/js/shared/game/gameObject");
const gameObjectShapes = require("../../public/js/shared/game/gameObjectShapes");
const gameObjectTypes = require("../../public/js/shared/game/gameObjectTypes");
const physicalConstant = require("../../public/js/shared/physics/physicalConstant");
const Player = require("../../public/js/shared/game/player");

class GameObjectBuilder {
	constructor(physics) {
		this.properties = {
			collisionFilter: {
				category: 1,
				mask: -1,
			},
			frictionAir: 0,
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

	withShape(shape) {
		this.properties.shape = shape;
		return this;
	}

	withName(name) {
		this.properties.name = name;
		return this;
	}

	withFrictionAir(frictionAir) {
		this.properties.frictionAir = frictionAir;
		return this;
	}

	create() {
		this._validateBase();
		let innerObject = this.createInnerObjectOfShape();
		let gameObject = this.encapsulate(innerObject);
		return gameObject;
	}

	createInnerObjectOfShape() {
		let innerObject = null;
		switch (this.properties.shape) {
			case gameObjectShapes.RECTANGLE:
				this._validateRectangle();
				innerObject = this._createRectangle();
				break;
			case gameObjectShapes.CIRCLE:
				this._validateCircle();
				innerObject = this._createCircle();
				break;
			default:
				throw new Error("Unknown shape: " + this.properties.shape);
		}
		return innerObject;
	}

	encapsulate(innerObject) {
		let gameObject = null;
		switch (this.properties.gameObjectType) {
			case gameObjectTypes.PLAYER:
				gameObject = new Player(
					this.properties.id,
					innerObject,
					physicalConstant.BASE_FORCE,
					this.properties.name
				);
				break;
			case gameObjectTypes.BOOST_ITEM:
				gameObject = new BoostItem(this.properties.id, innerObject);
				break;
			default:
				gameObject = new GameObject(
					this.properties.id,
					this.properties.gameObjectType,
					innerObject
				);
		}
		return gameObject;
	}

	_createRectangle() {
		return this.physics
			.getMatter()
			.Bodies.rectangle(
				this.properties.x,
				this.properties.y,
				this.properties.width,
				this.properties.height,
				{
					isStatic: this.properties.isStatic,
					frictionAir: this.properties.frictionAir,
					collisionFilter: this.properties.collisionFilter,
				}
			);
	}

	_createCircle() {
		return this.physics
			.getMatter()
			.Bodies.circle(
				this.properties.x,
				this.properties.y,
				this.properties.radius,
				{
					isStatic: this.properties.isStatic,
					frictionAir: this.properties.frictionAir,
					collisionFilter: this.properties.collisionFilter,
				}
			);
	}

	createPlayer() {
		this._validatePlayer();
		this.properties.x = physicalConstant.PLAYER_SPAWN_X;
		this.properties.y = physicalConstant.PLAYER_SPAWN_Y;
		this.properties.radius = physicalConstant.PLAYER_SIZE;
		this.properties.frictionAir = physicalConstant.FRICTION_AIR;
		this.properties.shape = gameObjectShapes.CIRCLE;
		this.properties.gameObjectType = gameObjectTypes.PLAYER;
		this.properties.isStatic = false;
		return this.create();
	}

	_validateBase() {
		let isNotValid =
			this.properties.x === undefined ||
			this.properties.y === undefined ||
			this.properties.isStatic === undefined ||
			this.properties.gameObjectType === undefined ||
			this.properties.id === undefined ||
			this.properties.shape === undefined;

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
