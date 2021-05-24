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
		if (collisionCategory || collisionCategory === 0) {
			this.properties.collisionFilter = {
				collisionFilter: collisionCategory,
				mask: 0,
			};
		}
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

	withFriction(friction) {
		this.properties.friction = friction;
		return this;
	}

	withInteria(interia) {
		this.properties.interia = interia;
		return this;
	}

	createFromGameObjectDescription(gameObjectDescription) {
		return this.withId(gameObjectDescription.id)
			.withGameObjectType(gameObjectDescription.type)
			.withShape(gameObjectDescription.shape)
			.withX(gameObjectDescription.x)
			.withY(gameObjectDescription.y)
			.withIsStatic(gameObjectDescription.isStatic)
			.withWidth(gameObjectDescription.width)
			.withHeight(gameObjectDescription.height)
			.withRadius(gameObjectDescription.radius)
			.withCollisionCategory(gameObjectDescription.collisionCategory)
			.withName(gameObjectDescription.name)
			.withFrictionAir(gameObjectDescription.frictionAir)
			.withFriction(gameObjectDescription.friction)
			.withInteria(gameObjectDescription.interia)
			.create();
	}

	create() {
		this._validateBase();
		let innerObject = this.createInnerObjectOfShape();
		return this.encapsulate(innerObject);
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
		let innerObject = this.physics
			.getMatter()
			.Bodies.rectangle(
				this.properties.x,
				this.properties.y,
				this.properties.width,
				this.properties.height,
				this._getInnerObjectParams()
			);
		innerObject.metadata = {
			shape: this.properties.shape,
			width: this.properties.width,
			height: this.properties.height,
		};
		return innerObject;
	}

	_createCircle() {
		let innerObject = this.physics
			.getMatter()
			.Bodies.circle(
				this.properties.x,
				this.properties.y,
				this.properties.radius,
				this._getInnerObjectParams()
			);
		innerObject.metadata = {
			shape: this.properties.shape,
			radius: this.properties.radius,
		};
		return innerObject;
	}

	_getInnerObjectParams() {
		let innerObjectParams = {
			isStatic: this.properties.isStatic,
			collisionFilter: this.properties.collisionFilter,
		};

		if (this.properties.friction || this.properties.friction === 0) {
			innerObjectParams.friction = this.properties.friction;
		}

		if (this.properties.frictionAir || this.properties.frictionAir === 0) {
			innerObjectParams.frictionAir = this.properties.frictionAir;
		}

		if (this.properties.interia || this.properties.interia === 0) {
			innerObjectParams.interia = this.properties.interia;
		}

		return innerObjectParams;
	}

	createPlayer() {
		this._validatePlayer();
		this.properties.x = physicalConstant.PLAYER_SPAWN_X;
		this.properties.y = physicalConstant.PLAYER_SPAWN_Y;
		this.properties.radius = physicalConstant.PLAYER_SIZE;
		this.properties.frictionAir = physicalConstant.PLAYER_FRICTION_AIR;
		this.properties.friction = physicalConstant.PLAYER_FRICTION;
		this.properties.interia = physicalConstant.PLAYER_INTERIA;
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
