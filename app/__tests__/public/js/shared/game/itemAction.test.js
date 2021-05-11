const ItemAction = require("../../../../../public/js/shared/game/itemAction");
const BoostItem = require("../../../../../public/js/shared/game/boostItem");
const Physics = require("../../../../../backend/physics/physics");
const GameState = require("../../../../../public/js/shared/game/gameState");
const Player = require("../../../../../public/js/shared/game/player");

jest.mock("../../../../../public/js/shared/game/boostItem")
jest.mock("../../../../../backend/physics/physics");

beforeEach(() => {
	BoostItem.mockClear();
	Physics.mockClear();
});

describe("Test the MoveAction class", () => {
	test("if run method consumes item", () => {
		let gameState = new GameState();
		gameState.lastTicTime = 0;
		let boostItem = new BoostItem();
		boostItem.id = 232;
		boostItem.consumed = false;
		let player = new Player(
			0,
			{
				position: { x: 23, y: 24 },
				velocity: { x: 10, y: 20 },
				force: { x: 0, y: 0 },
			},
			10
		);
		let physics = new Physics();
		player.id = 0;
		player.innerObject = {};
		player.item = boostItem;
		player.innerObject.positionImpulse = {}
		gameState.addAll([boostItem, player]);

		let testee = new ItemAction(physics);
		testee.run(gameState);

		expect(boostItem.applyToPlayer).toBeCalled();
	});
});
