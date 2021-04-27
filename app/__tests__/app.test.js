const request = require("supertest");
const app = require("../backend/app");

describe("Test the express routes", () => {
	test("It should response the GET method on root", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
	});

	test("It should response the GET method on levels", async () => {
		const response = await request(app).get("/levels");
		expect(response.statusCode).toBe(200);
	});

	test("It should response the GET method on levels with id", async () => {
		const response = await request(app).get("/levels/0");
		expect(response.statusCode).toBe(200);
	});

	test("It should response the GET method on players", async () => {
		const response = await request(app).get("/players");
		expect(response.statusCode).toBe(200);
	});
});
