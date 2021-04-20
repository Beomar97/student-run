const MoveAction = require("../../../../../public/js/shared/game/moveAction");
const Physics = require("../../../../../backend/physics/physics");
const GameState = require("../../../../../public/js/shared/game/gameState");
const { Player } = require("../../../../../public/js/shared/game/gameObject");
const gameObjectTypes = require("../../../../../public/js/shared/game/gameObjectTypes");

jest.mock("../../../../../backend/physics/physics");

beforeEach(() => {
	Physics.mockClear();
});

describe("Test the MoveAction class", () => {
	test("if run method moves movable objects.", () => {
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
			10
		);
		player.setDirection({ x: 1, y: 1 });
		gameState.addAll([player]);
		let physics = new Physics();

		let testee = new MoveAction(physics);
		testee.run(gameState);

		expect(physics.applyForce).lastCalledWith(
			player.innerObject,
			player.innerObject.position,
			{
				x: 10,
				y: 10,
			}
		);
	});
});
