var config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			gravity: { y: 0 },
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

var game = new Phaser.Game(config);

function preload() {}

function create() {
	var self = this;
	this.clientSync = new ClientSync();
	this.count = 0;
	this.clientSync.on(events.MESSAGE, (message) => console.log(message));
}

function update() {
	if (this.count % 100 === 0) {
		this.clientSync.emit(events.MESSAGE, "Hallo server");
	}
	this.count++;
}
