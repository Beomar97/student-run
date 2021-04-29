const request = require("supertest");
const app = require("../backend/app");

describe("Test the express routes", () => {
	test("It should response the GET method on root", async () => {
		const rootResponse = await request(app).get("/");
		expect(rootResponse.statusCode).toBe(200);
	});

	test("It should response the GET method on levels", async () => {
		const levelsResponse = await request(app).get("/levels");
		expect(levelsResponse.statusCode).toBe(200);
	});

	test("It should response the GET method on levels with id", async () => {
		const levelByIdResponse = await request(app).get("/levels/0");
		expect(levelByIdResponse.statusCode).toBe(200);
	});

	test("It should response the GET method on players", async () => {
		const playersResponse = await request(app).get("/players");
		expect(playersResponse.statusCode).toBe(200);
	});
});
