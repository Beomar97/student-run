const gameObjectTypes = require("./gameObjectTypes");

class MoveAction {
	constructor(physics) {
		this.physics = physics;
	}

	run(gameState) {
		gameState.forEachGameObject(
			(gameObject) => this._applyForce(gameObject),
			(gameObject) => {
				return (
					gameObject.type === gameObjectTypes.PLAYER &&
					gameObject.moving
				);
			}
		);
	}

	_applyForce(gameObject) {
		let innerObject = gameObject.innerObject;
		let direction = gameObject.direction;
		let baseForce = gameObject.baseForce;
		let force = {
			x: baseForce * direction.x,
			y: baseForce * direction.y,
		};
		this.physics.applyForce(innerObject, innerObject.position, force);
	}
}

module.exports = MoveAction;
