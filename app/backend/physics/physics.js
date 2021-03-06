class Physics {
	constructor(matter) {
		this.matter = matter;
		this.engine = this.matter.Engine.create();
		this.engine.world.gravity = { x: 0, y: 1, scale: 0.001 };
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

	applyForce(object, position, force) {
		this.matter.Body.applyForce(object, position, force);
	}

	setVelocity(object, position, velocity) {
		this.matter.Body.setVelocity(object, position, velocity);
	}

	removeObject(object) {
		this.matter.World.remove(this.engine.world, object);
	}

	update(time) {
		this.matter.Engine.update(this.engine, time);
	}

	addGameObjectsToWorld(gameObjectCollection) {
		gameObjectCollection.forEach((gameObject) => {
			this.matter.World.addBody(
				this.getEngine().world,
				gameObject.innerObject
			);
		});
	}
}

module.exports = Physics;
