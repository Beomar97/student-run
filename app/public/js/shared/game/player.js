const { MovingGameObject } = require("./gameObject");
const gameObjectTypes = require("./gameObjectTypes");

class Player extends MovingGameObject {
	constructor(id, innerObject, baseForce, name) {
		super(id, gameObjectTypes.PLAYER, innerObject, baseForce);
		this.done = false;
		this.timeToFinish = 0;
		this.name = name;
		this.isTouchingGround = false;
		this.innerObject.player = true;
	}
}
module.exports = Player;
