class Physics {
	constructor(matter) {
		this.matter = matter;
		this.engine = this.matter.Engine.create();
	}

	getMatter() {
		return this.matter;
	}

	getEngine() {
		return this.engine;
	}

	setPosition(object, position) {
		this.matter.Body.setPosition(object, position);
	}

	update(time) {
		this.matter.Engine.update(this.engine, time);
	}
}

module.exports = Physics;
