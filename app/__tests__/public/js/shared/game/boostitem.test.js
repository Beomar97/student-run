const Player = require("../../../../../public/js/shared/game/player");
const BoostItem = require("../../../../../public/js/shared/game/boostItem");
const gameObjectTypes = require("../../../../../public/js/shared/game/gameObjectTypes");

beforeEach(() => {
	player = new Player(0, {}, 0.005);
	boostItem = new BoostItem(0, {});
});

describe("Test the boostItem class", () => {
	test("if applyToPlayer method sets positionImpulse correctly", () => {
		player.innerObject.positionImpulse = {};
		boostItem.applyToPlayer(player);

		expect(player.innerObject.positionImpulse.x).toStrictEqual(100);
		expect(player.innerObject.positionImpulse.y).toStrictEqual(-20);
	});
});
