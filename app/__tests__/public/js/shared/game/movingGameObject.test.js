const {
	MovingGameObject,
} = require("../../../../../public/js/shared/game/gameObject");

describe("Test the MovingGameObject class", () => {
	test("if isMovingLeft returns correct results", () => {
		let testee = new MovingGameObject();
		testee.direction.x = -1;
		expect(testee.isMovingLeft()).toBe(true);
		testee.direction.x = 1;
		expect(testee.isMovingLeft()).toBe(false);
	});

	test("if isMovingRight returns correct results", () => {
		let testee = new MovingGameObject();
		testee.direction.x = 1;
		expect(testee.isMovingRight()).toBe(true);
		testee.direction.x = -1;
		expect(testee.isMovingRight()).toBe(false);
	});

	test("if isJumping returns correct results", () => {
		let testee = new MovingGameObject();
		testee.direction.y = 1;
		expect(testee.isJumping()).toBe(false);
		testee.direction.y = -1;
		expect(testee.isJumping()).toBe(true);
	});
});
