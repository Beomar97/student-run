const Timeline = require("../../../public/js/shared/game/timeline");
const Replay = require("../../../backend/game/replay");
const GameState = require("../../../public/js/shared/game/gameState");
const PhysicsUpdater = require("../../../public/js/shared/physics/physicsUpdater");
const Physics = require("../../../backend/physics/physics");
const Player = require("../../../public/js/shared/game/player");
const EventQueue = require("../../../backend/game/eventQueue");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");

jest.mock("../../../public/js/shared/physics/physicsUpdater");
jest.mock("../../../backend/physics/physics");
jest.mock("../../../backend/game/eventQueue");

beforeEach(() => {
	Physics.mockClear();
	PhysicsUpdater.mockClear();
	EventQueue.mockClear();
});

function createGameStateWithPlayer() {
	let gameState = new GameState();
	gameState.lastTicTime = 0;
	let player = new Player(
		0,
		gameObjectTypes.PLAYER,
		{
			position: { x: 23, y: 24 },
			velocity: { x: 10, y: 20 },
			force: { x: 0, y: 0 },
		},
		0.0005
	);
	player.setDirection({ x: 0, y: 0 });
	gameState.addAll([player]);
	return gameState;
}

describe("Test the Replay class", () => {
	test("if mayRevertAndReplay method replays if old event arrived.", () => {
		let gameState = new GameState();
		gameState.tic = 10;
		gameState.lastTicTime = 23;
		let eventQueue = {
			ticOfOldestEvent: 9,
			resetTicOfOldestEvent: jest.fn(() => {}),
		};
		let timeline = {};
		let physicsUpdater = new PhysicsUpdater();

		let testee = new Replay(
			gameState,
			new Physics(),
			eventQueue,
			timeline,
			physicsUpdater
		);
		testee._applySnapshotBeforeTic = jest.fn((tic) => {});

		testee.mayRevertAndReplay();

		expect(testee._applySnapshotBeforeTic).lastCalledWith(
			eventQueue.ticOfOldestEvent
		);
		expect(physicsUpdater.update).lastCalledWith(gameState.lastTicTime);
		expect(eventQueue.resetTicOfOldestEvent).toHaveBeenCalled();
	});

	test("if _applySnapshotBeforeTic method applies snapshot corretly", () => {
		let gameState = createGameStateWithPlayer();
		let physics = new Physics();
		let timeline = new Timeline(gameState, 2, 1);
		let testee = new Replay(
			gameState,
			physics,
			new EventQueue(),
			timeline,
			new PhysicsUpdater()
		);

		timeline.mayCreateSnapshot();

		let player = gameState.getGameObject(0);
		gameState.tic++;
		gameState.lastTicTime += 25;
		player.setDirection({ x: 1, y: 1 });

		timeline.mayCreateSnapshot();

		let originalGameState = createGameStateWithPlayer();
		let originalPlayer = originalGameState.getGameObject(0);
		testee._applySnapshotBeforeTic(originalGameState.tic);
		expect(gameState.tic).toEqual(originalGameState.tic);
		expect(gameState.lastTicTime).toEqual(originalGameState.lastTicTime);
		expect(player.moving).toEqual(originalPlayer.moving);
		expect(player.direction).toEqual(originalPlayer.direction);
		expect(physics.setPosition).lastCalledWith(
			originalPlayer.innerObject,
			originalPlayer.innerObject.position
		);
		expect(physics.setVelocity).lastCalledWith(
			originalPlayer.innerObject,
			originalPlayer.innerObject.velocity
		);
	});
});
