const { GameObject } = require("./gameObject");

class Item extends GameObject {
	constructor(id, type, innerObject) {
		super(id, type, innerObject);
		this.consumed = false;
	}

	applyToPlayer(player) {
		// Implemented by subclass
	}
}

module.exports = Item;
