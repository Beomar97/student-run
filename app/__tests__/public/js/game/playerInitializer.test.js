const mocks = require("../../../mocks/mocks");
const playerColors = require("../../../../public/js/helper/playerColors");
const PlayerInitializer = require("../../../../public/js/game/playerInitializer");

let phaser = mocks.phaser();

beforeEach(() => {
	mocks.util.resetPhaserMock(phaser);
});

describe("Test the PlayerInitializer class", () => {
	test("if PlayerInitializer adds player to game", () => {
		let players = [
			{
				baseForce: 0,
				direction: {},
				done: false,
				doneAt: null,
				id: 0,
				innerObject: {},
				moving: false,
				name: "Mustermann",
				type: "player",
			},
			{
				baseForce: 2,
				direction: {},
				done: false,
				doneAt: null,
				id: 1,
				innerObject: {},
				moving: false,
				name: "Musterfrau",
				type: "player",
			},
		];

		let testee = new PlayerInitializer(phaser);
		testee.addJSONObjectsToPhaser(players);

		expect(phaser.add.sprite).toHaveBeenCalled();
		expect(phaser.matter.add.circle).toHaveBeenCalled();
	});

	test("if PlayerInitializer sets correct colors", () => {
		let players = [
			{
				baseForce: 0,
				direction: {},
				done: false,
				doneAt: null,
				id: 0,
				innerObject: {},
				moving: false,
				name: "Mustermann",
				type: "player",
			},
			{
				baseForce: 2,
				direction: {},
				done: false,
				doneAt: null,
				id: 1,
				innerObject: {},
				moving: false,
				name: "Musterfrau",
				type: "player",
			},
			{
				baseForce: 2,
				direction: {},
				done: false,
				doneAt: null,
				id: 2,
				innerObject: {},
				moving: false,
				name: "Musterfrau",
				type: "player",
			},
		];

		let testee = new PlayerInitializer(phaser);
		testee.addJSONObjectsToPhaser(players);

		expect(testee.getPhaserPlayerById(0).tint).toBe(playerColors[0]);
		expect(testee.getPhaserPlayerById(1).tint).toBe(playerColors[1]);
		expect(testee.getPhaserPlayerById(2).tint).toBe(playerColors[2]);
	});
});
