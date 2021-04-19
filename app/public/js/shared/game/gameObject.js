class GameObject {
	constructor(id, type, innerObject) {
		this.id = id;
		this.type = type;
		this.innerObject = innerObject;
	}
}

class Player extends GameObject {
	constructor(id, type, innerObject) {
		super(id, type, innerObject);
		this.done = false;
		this.doneAt = null;
	}
}

module.exports = { GameObject, Player };
