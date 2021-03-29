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
var cursors;
var player;

function preload() {
	this.load.image("sky", "assets/sky.png");
}

function create() {
	// Init World
	this.add.image(400, 300, "sky");
	this.matter.world.setBounds(0, 0, game.config.width, game.config.height);

	// Objects
	let floor = this.matter.add.rectangle(0, 580, 1600, 20, {
		isStatic: true,
	});
	let ledgeOne = this.matter.add.rectangle(400, 450, 400, 20, {
		isStatic: true,
	});
	let ledgeTwo = this.matter.add.rectangle(0, 300, 600, 20, {
		isStatic: true,
	});
	let ledgeThree = this.matter.add.rectangle(700, 200, 800, 20, {
		isStatic: true,
	});
	player = this.matter.add.circle(250, 250, 20);

	// Sync
	this.gameState = new GameState();
	this.gameState.addAll([
		new GameObject(0, gameObjectTypes.PLAYER, player),
		new GameObject(1, gameObjectTypes.STATIC_OBSTACLE, floor),
		new GameObject(2, gameObjectTypes.STATIC_OBSTACLE, ledgeOne),
		new GameObject(3, gameObjectTypes.STATIC_OBSTACLE, ledgeTwo),
		new GameObject(4, gameObjectTypes.STATIC_OBSTACLE, ledgeThree),
	]);

	this.clientSync = new ClientSync();
	this.updateHandler = new UpdateHandler(
		this.clientSync,
		this.matter,
		this.gameState
	);
	this.updateHandler.init();

	cursors = this.input.keyboard.createCursorKeys();
}

function update() {
	if (cursors.left.isDown) {
		this.clientSync.emit(events.START_MOVING_LEFT, {
			id: 0
		});
	} else if (cursors.right.isDown) {
		this.clientSync.emit(events.START_MOVING_RIGHT, {
			id: 0
		});
	}

	if (cursors.up.isDown) {
		this.clientSync.emit(events.START_MOVING_UP, {
			id: 0
		});
	}
}

function update() {}
