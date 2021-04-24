const Phaser = require("phaser");
const { io } = require("socket.io-client");
const LevelInitializer = require("./levelInitializer");
const ClientSync = require("./sync/clientSync");
const UpdateHandler = require("./sync/updateHandler");
const { Player } = require("./shared/game/gameObject");
const GameState = require("./shared/game/gameState");
const gameObjectTypes = require("./shared/game/gameObjectTypes");
const events = require("./shared/sync/events");
const PhysicsUpdater = require("./shared/physics/physicsUpdater");
const UpdateLock = require("./sync/updateLock");
const MoveAction = require("./shared/game/moveAction");

var config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 1000,
	height: 700,
	pixelArt: true,
	physics: {
		default: "matter",
		matter: {
			debug: true,
			gravity: { x: 0, y: 1, scale: 0.001 },
			autoUpdate: false,
		},
		msPerTic: 1000 / 40,
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

var game = new Phaser.Game(config);

function preload() {
	this.load.image("background", "assets/sky.png");
	this.load.json("levelData", "levels/0");
	this.load.image("star", "assets/star.png");
	this.load.spritesheet("player", "assets/dude.png", {
		frameWidth: 32,
		frameHeight: 48,
	});
}

function create() {
	// Init World
	let leveldata = this.cache.json.get("levelData");
	this.matter.world.setBounds(
		0,
		0,
		leveldata.wordWidth,
		leveldata.worldHeight
	);
	let gameObjectCollection = [];
	this.add
		.image(game.config.width / 2, game.config.height / 2, "background")
		.setScale(20);

	// Init Player
	this.phaserPlayer = this.add.sprite(300, 300, "player");
	this.matterPlayer = this.matter.add.circle(300, 300, 25, {
		frictionAir: 0.3,
	});
	this.player = new Player(
		0,
		gameObjectTypes.PLAYER,
		this.matterPlayer,
		0.005
	);
	this.matter.add.gameObject(this.phaserPlayer, this.matterPlayer);
	gameObjectCollection.push(this.player);

	// Init Objects
	let levelInitializer = new LevelInitializer(this);
	let loadedObjects = levelInitializer.addJSONObjectsToPhaser(leveldata);
	gameObjectCollection = gameObjectCollection.concat(loadedObjects);

	// Animation
	this.anims.create({
		key: "left",
		frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1,
	});

	this.anims.create({
		key: "turn",
		frames: [{ key: "player", frame: 4 }],
		frameRate: 20,
	});

	this.anims.create({
		key: "right",
		frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1,
	});

	// Sync
	this.gameState = new GameState();
	this.gameState.addAll(gameObjectCollection);

	this.updateLock = new UpdateLock(this.player.id);
	this.clientSync = new ClientSync(io());
	this.updateHandler = new UpdateHandler(
		this.clientSync,
		this.matter,
		this.gameState,
		this.updateLock
	);
	this.updateHandler.init();

	this.running = false;
	this.clientSync.on(events.GAME_START, (startTime) => {
		this.gameState.lastTicTime = startTime;
		this.running = true;
	});

	let moveAction = new MoveAction(this.matter.body);
	let updatePhysics = (delta) => {
		moveAction.run(this.gameState);
		this.matter.world.step(delta);
	};

	this.physicsUpdater = new PhysicsUpdater(
		this.gameState,
		updatePhysics,
		game.config.physics.msPerTic
	);

	// Input & Output
	this.cursors = this.input.keyboard.createCursorKeys();
	this.cameras.main.startFollow(this.phaserPlayer, true, 0.9, 0.9);
}

function update() {
	if (this.running) {
		if (this.player.done) {
			this.phaserPlayer.anims.play("turn", true);
			this.running = false;
			alert("Done!");
		}

		let steeringDirection = { x: 0, y: 0 };
		if (this.cursors.left.isDown) {
			steeringDirection.x = -1;
			this.phaserPlayer.anims.play("left", true);
		} else if (this.cursors.right.isDown) {
			steeringDirection.x = 1;
			this.phaserPlayer.anims.play("right", true);
		} else {
			this.phaserPlayer.anims.play("turn", true);
		}

		if (this.cursors.up.isDown) {
			steeringDirection.y = -1;
		}

		let playerDirection = this.player.direction;
		if (
			playerDirection.x !== steeringDirection.x ||
			playerDirection.y !== steeringDirection.y
		) {
			this.player.setDirection(steeringDirection);
			this.clientSync.emit(events.MOVEMENT_CHANGE_EVENT, {
				id: this.player.id,
				tic: this.gameState.tic,
				direction: steeringDirection,
			});
			this.updateLock.lock(this.gameState.tic);
		}

		this.physicsUpdater.update(Date.now());
	}
}
