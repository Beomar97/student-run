const gameObjectTypes = require("./gameObjectTypes");
const PhysicalConstant = require("../physics/physicalConstant");
const playerColors = require("../../helper/playerColors");

class MoveAction {
	constructor(physics) {
		this.physics = physics;
	}

	run(gameState) {
		gameState.forEachGameObject(
			(gameObject) => this._applyMovement(gameObject),
			(gameObject) => {
				return (
					gameObject.type === gameObjectTypes.PLAYER &&
					gameObject.moving
				);
			}
		);
	}

	_applyMovement(gameObject) {
		this._moveGameObject(gameObject);
		this._jumpGameObject(gameObject);
	}

	_moveGameObject(gameObject) {
		let innerObject = gameObject.innerObject;
		let direction = gameObject.direction;
		let baseForce = gameObject.baseForce;
		let force = {
			x: baseForce * direction.x,
			y: 0,
		};
		this.physics.applyForce(innerObject, innerObject.position, force);
	}

	_jumpGameObject(gameObject) {
		if (gameObject.direction.y === 1) {
			let innerObject = gameObject.innerObject;
			let jumpSpeed = -PhysicalConstant.PLAYER_JUMP_DENSITY;
			this.physics.setVelocity(innerObject, {
				x: innerObject.velocity.x,
				y: jumpSpeed,
			});
			gameObject.setDirectionY(0);
		}
	}
}

module.exports = MoveAction;
