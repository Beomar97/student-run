const Player = require("../../../../../public/js/shared/game/player");

beforeEach(() => {
	player = new Player(0, {}, 0.005);
});

describe("Test the Player class", () => {
	test("if setDirection method sets direction correctly.", () => {
		let direction = { x: 1, y: 1 };
		player.setDirection(direction);

		expect(player.direction).toStrictEqual(direction);
	});
});
