var config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 800,
	height: 600,
	backgroundColor: "#4d4d4d",
	physics: {
		default: "matter",
		matter: {
			debug: true,
			gravity: {
				x: 0,
				y: 0,
			},
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
	this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

	this.gameState = new GameState();
	let floor = this.matter.add.rectangle(0, 580, 800, 20, {
		isStatic: true,
	});
	let player = this.matter.add.rectangle(0, 550, 30, 30, {
		isStatic: true,
	});
	this.gameState.addAll([
		new GameObject(0, gameObjectTypes.PLAYER, player),
		new GameObject(1, gameObjectTypes.STATIC_OBSTACLE, floor),
	]);

	this.clientSync = new ClientSync();
	this.updateHandler = new UpdateHandler(
		this.clientSync,
		this.matter,
		this.gameState
	);
	this.updateHandler.init();

	this.input.on("pointerup", (event) => {
		this.clientSync.emit(events.START_MOVING, {
			id: 0,
			position: {
				x: event.prevPosition.x,
				y: event.prevPosition.y,
			},
		});
	});
}

function update() {}
