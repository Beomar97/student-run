const Phaser = require("phaser");
const { io } = require("socket.io-client");
const LevelInitializer = require("./levelInitializer");
const ClientSync = require("../sync/clientSync");
const UpdateHandler = require("../sync/updateHandler");
const PlayerInitializer = require("./playerInitializer");
const GameState = require("../shared/game/gameState");
const events = require("../shared/sync/events");
const PhysicsUpdater = require("../shared/physics/physicsUpdater");
const UpdateLock = require("../sync/updateLock");
const MoveAction = require("../shared/game/moveAction");
const GameViewController = require("../view/gameViewController");
const Timeline = require("../shared/game/timeline");
const Interpolator = require("../sync/interpolator");
const ItemAction = require("../shared/game/itemAction");
const gameObjectTypes = require("../shared/game/gameObjectTypes");
const {
	CollisionDetector,
	gameObjectMatchers,
} = require("./collisionDetector");
const Animator = require("./animator");
const Jukebox = require("./jukebox");

class GameScene extends Phaser.Scene {
	constructor(config) {
		super(config);
		this.running = false;
		this.gameState = null;
		this.myPlayerId = null;
		this.clientSync = null;
		this.physicsUpdater = null;
		this.updateLock = null;
		this.animator = null;
	}

	preload() {
		this.load.image("background", "assets/world/sky.png");
		this.load.json("levelData", "levels/2");
		this.load.spritesheet("flag", "assets/sprites/flag.png", {
			frameWidth: 80,
			frameHeight: 128,
		});
		this.load.json("playerData", "players");
		this.load.image("star", "assets/sprites/star.png");
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
	}

	create(data) {
		this._initWorld();
		this._initIO();
		this._initSync();
		this._initPhysics();

		this._listenForGameStartEvent();
		this.clientSync.emit(events.PLAYER_READY, this.myPlayerId);
	}

	update(time, delta) {
		if (this.running) {
			this._processUserInput();
			this.physicsUpdater.update(Date.now());
			this.animator.animate(this.gameState);
		}
	}

	_initWorld() {
		let leveldata = this.cache.json.get("levelData");
		this.matter.world.setBounds(
			0,
			0,
			leveldata.wordWidth,
			leveldata.worldHeight
		);
		let gameObjectCollection = [];
		this.add
			.image(
				this.game.config.width / 2,
				this.game.config.height / 2,
				"background"
			)
			.setScale(20);

		// Init Objects
		let levelInitializer = new LevelInitializer(this);
		let loadedObjects = levelInitializer.addJSONObjectsToPhaser(leveldata);
		gameObjectCollection = gameObjectCollection.concat(loadedObjects);

		// Init Player
		let playerData = this.cache.json.get("playerData");
		let playerInitializer = new PlayerInitializer(this);
		let loadedPlayers = playerInitializer.addJSONObjectsToPhaser(
			playerData
		);
		this.myPlayerId = parseInt(localStorage.getItem("playerId"));

		// GameState
		this.gameState = new GameState();
		this.gameState.addAll(gameObjectCollection.concat(loadedPlayers));
	}

	_initSync() {
		this.updateLock = new UpdateLock(this.myPlayerId);
		this.clientSync = new ClientSync(io());
		let gameViewController = new GameViewController();
		this.timeline = new Timeline(
			this.gameState,
			this.game.config.customConfig.interpolation.maxDiff,
			this.game.config.customConfig.interpolation.ticsPerSnapshot
		);
		let interpolator = new Interpolator(
			this.matter,
			this.timeline,
			Phaser.Math,
			this.game.config.customConfig.interpolation
		);
		let updateHandler = new UpdateHandler(
			this.clientSync,
			this.gameState,
			interpolator,
			this.updateLock,
			this.myPlayerId,
			gameViewController,
			this.jukebox
		);
		updateHandler.init();
	}

	_initPhysics() {
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
			this.game.config.physics.msPerTic,
			{ log: (messageJson) => console.log(JSON.stringify(messageJson)) }
		);

		let collisionDetector = new CollisionDetector(
			this.gameState,
			this.matter.world
		);

		let myPlayerMatcher = gameObjectMatchers.byId(this.myPlayerId);
		let staticObstacleMatcher = gameObjectMatchers.byTypes([
			gameObjectTypes.STATIC_OBSTACLE,
			gameObjectTypes.STATIC_OBSTACLE_SPRITE,
			gameObjectTypes.STATIC_OBSTACLE_TILESPRITE,
		]);

		collisionDetector.onCollisionStart(
			(player, staticObstacle) => {
				player.isTouchingGround = true;
			},
			myPlayerMatcher,
			staticObstacleMatcher
		);

		collisionDetector.onCollisionEnd(
			(player, staticObstacle) => {
				player.isTouchingGround = false;
			},
			myPlayerMatcher,
			staticObstacleMatcher
		);

		collisionDetector.onCollisionStart(
			this._handleItemCollisionEvent.bind(this),
			myPlayerMatcher,
			gameObjectMatchers.byTypes([gameObjectTypes.BOOST_ITEM])
		);
	}

	_handleItemCollisionEvent(player, item) {
		player.item = item;
		this.gameState.removeGameObject(item.id);
		item.innerObject.gameObject.destroy();
		this.clientSync.emit(events.PLAYER_COLLECTED_ITEM, {
			playerId: player.id,
			itemId: item.id,
			tic: this.gameState.tic,
		});
		this.updateLock.lock(this.gameState.tic);
	}

	_initIO() {
		this.cursors = this.input.keyboard.createCursorKeys();
		this.jukebox = new Jukebox(this.sound);
		this.jukebox.playSoundTrack();
		this.cameras.main.startFollow(
			this.gameState.getGameObject(this.myPlayerId).innerObject
				.gameObject,
			true,
			0.9,
			0.9
		);
		this.animator = new Animator();
		this.animator.init(this.anims, "player");
	}

	_listenForGameStartEvent() {
		this.clientSync.on(events.GAME_START, (startTime) => {
			this.gameState.lastTicTime = startTime;
			this.gameState.startTime = startTime;
			this.running = true;
			console.log("start game at: " + startTime + ", now: " + Date.now());
		});
	}

	_processUserInput() {
		let player = this.gameState.getGameObject(this.myPlayerId);

		let steeringDirection = 0;
		if (this.cursors.left.isDown) {
			steeringDirection = -1;
		} else if (this.cursors.right.isDown) {
			steeringDirection = 1;
		}

		let playerDirection = player.direction;

		if (playerDirection.x !== steeringDirection) {
			player.setDirectionX(steeringDirection);
			this.clientSync.emit(events.MOVEMENT_CHANGE_EVENT, {
				id: this.myPlayerId,
				tic: this.gameState.tic,
				direction: steeringDirection,
			});
			this.updateLock.lock(this.gameState.tic);
		}

		if (
			player.isTouchingGround &&
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
	}
}

module.exports = GameScene;
