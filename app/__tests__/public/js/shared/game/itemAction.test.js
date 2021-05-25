const ItemAction = require("../../../../../public/js/shared/game/itemAction");
const BoostItem = require("../../../../../public/js/shared/game/boostItem");
const Physics = require("../../../../../backend/physics/physics");
const GameState = require("../../../../../public/js/shared/game/gameState");
const Player = require("../../../../../public/js/shared/game/player");

jest.mock("../../../../../backend/physics/physics");

beforeEach(() => {
	Physics.mockClear();
});

describe("Test the ItemAction class", () => {
	test("if run method consumes item", () => {
		let gameState = new GameState();
		gameState.lastTicTime = 0;
		let boostItem = new BoostItem(1, { id: 1 });
		let player = new Player(
			0,
			{
				id: 0,
				position: { x: 23, y: 24 },
				velocity: { x: 10, y: 20 },
				force: { x: 0, y: 0 },
				positionImpulse: {},
			},
			10,
			"name"
		);
		let physics = new Physics();
		player.item = boostItem;
		gameState.addAll([boostItem, player]);

		let testee = new ItemAction(physics);
		testee.run(gameState);

		expect(player.innerObject.positionImpulse).toEqual({ x: 100, y: -20 });
	});
});
