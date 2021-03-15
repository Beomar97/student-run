// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require("supertest");
const app = require("../backend/app");

describe("Test the root path", () => {
	test("It should response the GET method", async () => {
		const response = await request(app).get("/");
		expect(response.statusCode).toBe(200);
	});
});

/* TODO: When DB connection is setup
describe('Test the addLike method', () => {
  beforeAll(() => {
      mongoDB.connect();
  });

  afterAll((done) => {
      mongoDB.disconnect(done);
  });
}
*/
