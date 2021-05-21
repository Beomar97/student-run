const mocks = require("../../../mocks/mocks");
const PlayerInitializer = require("../../../../public/js/game/playerInitializer");

let phaser = mocks.phaser();
phaser.setScale = function(scale) {}
phaser.add.sprite.mockReturnValue({
	setScale: function(scale) {}
})

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
});
