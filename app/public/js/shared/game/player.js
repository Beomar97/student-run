const { MovingGameObject } = require("./gameObject");
const matter = require("matter-js");
const PhysicalConstant = require("../physics/physicalConstant");

class Player extends MovingGameObject {
	constructor(id, type, innerObject, baseForce, name) {
		super(id, type, innerObject, baseForce);
		this.done = false;
		this.doneAt = null;
		this.name = name;
		this.isTouchingGround = false;
		this.Vector = matter.Vector;
	}
}
module.exports = Player;
