const Item = require("../../../../../public/js/shared/game/item");

describe("Test the item class", () => {
	test("if applyToPlayer returns nothing.", () => {
		let testee = new Item();
		expect(testee.applyToPlayer()).toBeFalsy();
	});
});
