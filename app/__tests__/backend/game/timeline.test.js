const GameState = require("../../../public/js/shared/game/gameState");
const Physics = require("../../../backend/physics/physics");
const mocks = require("../../mocks/mocks");
const { Player } = require("../../../public/js/shared/game/gameObject");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const Timeline = require("../../../backend/game/timeline");

jest.mock("../../../backend/physics/physics");

beforeEach(() => {
	Physics.mockClear();
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

describe("Test the Timeline class", () => {
	test("if mayCreateSnapshot method creates snapshot", () => {
		let gameState = createGameStateWithPlayer();
		let testee = new Timeline(gameState, new Physics(), 1, 1);
		testee.mayCreateSnapshot();

		let snapshot = testee.snapshots.get(gameState.tic);
		let player = gameState.getGameObject(0);
		let playerSnapshot = snapshot.gameObjects[0];

		expect(snapshot.tic).toEqual(gameState.tic);
		expect(snapshot.lastTicTime).toEqual(gameState.lastTicTime);
		expect(playerSnapshot.innerObject.position).toEqual(
			player.innerObject.position
		);
		expect(playerSnapshot.innerObject.velocity).toEqual(
			player.innerObject.velocity
		);
		expect(playerSnapshot.direction).toEqual(player.direction);
		//gameState.getGameObject(0).direction = { x: 1, y: 1 };
	});

	test("if mayCreateSnapshot method overrides snapshot when same tic", () => {
		let gameState = createGameStateWithPlayer();
		let testee = new Timeline(gameState, new Physics(), 1, 1);

		testee.mayCreateSnapshot();
		expect(testee.snapshots.size).toEqual(1);

		let newPosition = { x: 123, y: 123 };
		gameState.getGameObject(0).innerObject.position = newPosition;
		testee.mayCreateSnapshot();

		let snapshot = testee.snapshots.get(gameState.tic);
		let playerSnapshot = snapshot.gameObjects[0];
		expect(testee.snapshots.size).toEqual(1);
		expect(playerSnapshot.innerObject.position).toEqual(newPosition);
	});

	test("if mayCreateSnapshot method deletes old snapshots when maxSnapshots is exceeded.", () => {
		let gameState = createGameStateWithPlayer();
		let testee = new Timeline(gameState, new Physics(), 1, 1);

		testee.mayCreateSnapshot();
		gameState.tic++;
		testee.mayCreateSnapshot();
		expect(testee.snapshots.size).toEqual(1);
		expect(testee.snapshots.get(gameState.tic)).toBeTruthy();
	});

	test("if applySnapshotBeforeTic method applies snapshot corretly", () => {
		let gameState = createGameStateWithPlayer();
		let physics = new Physics();
		let testee = new Timeline(gameState, physics, 2, 1);

		testee.mayCreateSnapshot();

		let player = gameState.getGameObject(0);
		gameState.tic++;
		gameState.lastTicTime += 25;
		player.setDirection({ x: 1, y: 1 });

		testee.mayCreateSnapshot();

		let originalGameState = createGameStateWithPlayer();
		let originalPlayer = originalGameState.getGameObject(0);
		testee.applySnapshotBeforeTic(originalGameState.tic);
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
