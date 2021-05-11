const GameState = require("../../../public/js/shared/game/gameState");
const Player = require("../../../public/js/shared/game/player");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const Timeline = require("../../../public/js/shared/game/timeline");

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
		let testee = new Timeline(gameState, 1, 1);
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
	});

	test("if mayCreateSnapshot method overrides snapshot when same tic", () => {
		let gameState = createGameStateWithPlayer();
		let testee = new Timeline(gameState, 1, 1);

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
		let testee = new Timeline(gameState, 1, 1);

		testee.mayCreateSnapshot();
		gameState.tic++;
		testee.mayCreateSnapshot();
		expect(testee.snapshots.size).toEqual(1);
		expect(testee.snapshots.get(gameState.tic)).toBeTruthy();
	});
});
