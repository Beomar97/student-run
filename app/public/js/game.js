const Phaser = require("phaser");
const { io } = require("socket.io-client");
const $ = require("jquery");
const LevelInitializer = require("./levelInitializer");
const ClientSync = require("./sync/clientSync");
const UpdateHandler = require("./sync/updateHandler");
const PlayerInitializer = require("./playerInitializer");
const GameState = require("./shared/game/gameState");
const events = require("./shared/sync/events");
const PhysicsUpdater = require("./shared/physics/physicsUpdater");
const UpdateLock = require("./sync/updateLock");
const MoveAction = require("./shared/game/moveAction");
const GameViewController = require("./view/gameViewController");
const Timeline = require("./shared/game/timeline");
const Interpolator = require("./sync/interpolator");
const ItemAction = require("./shared/game/itemAction");

let config = {
	type: Phaser.AUTO,
	parent: "student-run",
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
	interpolation: {
		maxDiff: 15,
		lowerDistanceDiffThreshold: 2,
		upperDistanceDiffThreshold: 50,
		interpolationMaxStep: 3,
		ticDiffThreshold: 2,
		ticsPerSnapshot: 4, // should be in sync with game state publish
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
	this.load.json("levelData", "levels/2");
	this.load.spritesheet("flag", "assets/sprites/flag.png", {
		frameWidth: 80,
		frameHeight: 128,
	});
	this.load.json("playerData", "players");
	this.load.image("star", "assets/star.png");
	this.load.spritesheet("player", "assets/sprites/dude.png", {
		frameWidth: 32,
		frameHeight: 48,
	});
	this.load.image("platform", "assets/world/platform.png");
	this.load.image("platform2", "assets/world/platform2.png");
	this.load.image("ground", "assets/world/ground.png");
	this.load.image("dirt", "assets/world/dirt.png");
	this.load.image("signpost", "assets/world/signpost.png");
	this.load.image("tree", "assets/world/tree.png");
	this.load.image("stone", "assets/world/stone.png");
	this.load.image("rope_railing", "assets/world/rope_railing.png");
	this.load.image("wood_railing", "assets/world/wood_railing.png");

	this.load.audio("level_audio", "assets/audio/level_audio.mp3");
	this.load.audio("done_audio", "assets/audio/done_audio.mp3");
	this.load.audio("jump_audio", "assets/audio/done_audio.mp3");
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

	// Init Objects
	let levelInitializer = new LevelInitializer(this);
	let loadedObjects = levelInitializer.addJSONObjectsToPhaser(leveldata);
	gameObjectCollection = gameObjectCollection.concat(loadedObjects);

	// Init Player
	let playerData = this.cache.json.get("playerData");
	let playerInitializer = new PlayerInitializer(this);
	let loadedPlayers = playerInitializer.addJSONObjectsToPhaser(playerData);
	this.myPlayerId = parseInt(localStorage.getItem("playerId"));
	this.myPhaserPlayer = playerInitializer.getPhaserPlayerById(
		this.myPlayerId
	);
	gameObjectCollection = gameObjectCollection.concat(loadedPlayers);

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

	this.updateLock = new UpdateLock(this.myPlayerId);
	this.clientSync = new ClientSync(io());
	this.gameViewController = new GameViewController();
	this.timeline = new Timeline(
		this.gameState,
		config.interpolation.maxDiff,
		config.interpolation.ticsPerSnapshot
	);
	this.updateHandler = new UpdateHandler(
		this.clientSync,
		this.gameState,
		new Interpolator(
			this.matter,
			this.timeline,
			Phaser.Math,
			config.interpolation
		),
		this.updateLock,
		this.myPlayerId,
		this.gameViewController
	);
	this.updateHandler.init();

	this.running = false;
	this.clientSync.on(events.GAME_START, (startTime) => {
		this.gameState.lastTicTime = startTime;
		this.gameState.startTime = startTime;
		this.running = true;
		console.log("start game at: " + startTime + ", now: " + Date.now());
	});

	let moveAction = new MoveAction(this.matter.body);
	let itemAction = new ItemAction(this.matter.body);
	let updatePhysics = (delta) => {
		this.timeline.mayCreateSnapshot();
		moveAction.run(this.gameState);
		itemAction.run(this.gameState);
		this.matter.world.step(delta);
	};

	this.physicsUpdater = new PhysicsUpdater(
		this.gameState,
		updatePhysics,
		game.config.physics.msPerTic,
		{ log: (messageJson) => console.log(JSON.stringify(messageJson)) }
	);

	// Input & Output
	this.cursors = this.input.keyboard.createCursorKeys();
	this.cameras.main.startFollow(this.myPhaserPlayer, true, 0.9, 0.9);
	this.sound.play("level_audio", {
		volume: 0.1,
		loop: true,
	});

	this.myPlayer = this.gameState.getGameObject(this.myPlayerId);
	this.matter.world.on(
		"collisionstart",
		(event, gameObjectA, gameObjectB) => {
			if (
				this.myPlayer.innerObject.id === gameObjectA.id &&
				gameObjectB.isGroundElement
			) {
				this.myPlayer.isTouchingGround = true;
			}
			if (
				gameObjectA.isGroundElement &&
				this.myPlayer.innerObject.id === gameObjectB.id
			) {
				this.myPlayer.isTouchingGround = true;
			}
		}
	);
	this.matter.world.on("collisionend", (event, gameObjectA, gameObjectB) => {
		if (
			this.myPlayer.innerObject.id === gameObjectA.id &&
			gameObjectB.isGroundElement
		) {
			this.myPlayer.isTouchingGround = false;
		}
		if (
			gameObjectA.isGroundElement &&
			this.myPlayer.innerObject.id === gameObjectB.id
		) {
			this.myPlayer.isTouchingGround = false;
		}
	});

	this.matter.world.on(
		"collisionstart",
		function (event, bodyA, bodyB) {
			let itemInnerObject;
			let playerInnerObject;
			if (bodyA.collectableItem) {
				itemInnerObject = bodyA;
			} else if (bodyA.player) {
				playerInnerObject = bodyB;
			}
			if (bodyB.collectableItem) {
				itemInnerObject = bodyB;
			} else if (bodyB.player) {
				playerInnerObject = bodyB;
			}
			if (playerInnerObject && itemInnerObject) {
				let player = this.gameState.getGameObjectByInnerObjectId(
					playerInnerObject.id
				);
				let item = this.gameState.getGameObjectByInnerObjectId(
					itemInnerObject.id
				);

				if (this.myPlayerId === player.id) {
					player.item = item;
					this.gameState.removeGameObject(item.id);
					itemInnerObject.gameObject.destroy();
					this.clientSync.emit(events.PLAYER_COLLECTED_ITEM, {
						playerId: player.id,
						itemId: item.id,
						tic: this.gameState.tic,
					});
					this.updateLock.lock(this.gameState.tic);
				}
			}
		}.bind(this)
	);

	this.clientSync.emit(events.PLAYER_READY, this.myPlayerId);
}

function update() {
	if (this.running) {
		if (this.gameState.getGameObject(this.myPlayerId).done) {
			this.myPhaserPlayer.anims.play("turn", true);
			this.sound.pauseAll();
			this.sound.play("done_audio", {
				volume: 0.1,
				loop: false,
			});
			this.running = false;
			$("#student-run").remove();
		}

		let steeringDirection = 0;
		if (this.cursors.left.isDown) {
			steeringDirection = -1;
			this.myPhaserPlayer.anims.play("left", true);
		} else if (this.cursors.right.isDown) {
			steeringDirection = 1;
			this.myPhaserPlayer.anims.play("right", true);
		} else {
			this.myPhaserPlayer.anims.play("turn", true);
		}

		let player = this.gameState.getGameObject(this.myPlayerId);
		let playerDirection = player.direction;

		if (
			this.myPlayer.isTouchingGround &&
			this.cursors.up.isDown &&
			playerDirection.y === 0
		) {
			player.setDirectionY(1);

			this.clientSync.emit(events.PLAYER_JUMP, {
				id: this.myPlayerId,
				tic: this.gameState.tic,
			});
			this.updateLock.lock(this.gameState.tic);
		}

		if (playerDirection.x !== steeringDirection) {
			player.setDirectionX(steeringDirection);
			this.clientSync.emit(events.MOVEMENT_CHANGE_EVENT, {
				id: this.myPlayerId,
				tic: this.gameState.tic,
				direction: steeringDirection,
			});
			this.updateLock.lock(this.gameState.tic);
		}

		this.physicsUpdater.update(Date.now());
	}
}
