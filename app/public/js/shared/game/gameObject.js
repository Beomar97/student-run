class GameObject {
	constructor(id, type, innerObject) {
		this.id = id;
		this.type = type;
		this.innerObject = innerObject;
	}
}

class MovingGameObject extends GameObject {
	constructor(id, type, innerObject, baseForce) {
		super(id, type, innerObject);
		this.baseForce = baseForce;
		this.moving = false;
		this.direction = { x: 0, y: 0 };
	}

	setDirection(direction) {
		this.direction = direction;
		this.moving = direction.x !== 0 || direction.y !== 0;
	}

	isMovingLeft() {
		return this.direction.x < 0;
	}

	isMovingRight() {
		return this.direction.x > 0;
	}

	isJumping() {
		return this.direction.y < 0;
	}
}

class Player extends MovingGameObject {
	constructor(id, type, innerObject, baseForce, name) {
		super(id, type, innerObject, baseForce);
		this.done = false;
		this.doneAt = null;
		this.name = name;
	}
}

module.exports = { GameObject, MovingGameObject, Player };
