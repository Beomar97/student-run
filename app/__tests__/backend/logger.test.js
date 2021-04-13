const logger = require("../../backend/logger");

describe("Test the logger", () => {
	test("if loglevel is set properly.", () => {
		expect(logger.level).toBe("info");
	});
});
