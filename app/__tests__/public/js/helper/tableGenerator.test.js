const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const TableGenerator = require("../../../../public/js/helper/tableGenerator");

const dom = new JSDOM();
document = dom.window.document;
window = dom.window;

describe("Test the TableGenerator class", () => {
	test("if run method moves movable objects.", () => {
		document.body.innerHTML = '<div id="players"></div>';
		let testData = [
			{ id: 0, name: "hans" },
			{ id: 1, name: "maria" },
		];
		let expectedTable =
			'<div id="players"><table class="table is-fullwidth"><thead><tr><th>id</th><th>name</th></tr></thead><tbody><tr><td>0</td><td>hans</td></tr><tr><td>1</td><td>maria</td></tr></tbody></table></div>';

		let testee = new TableGenerator();
		testee.generate(
			["id", "name"],
			testData,
			document.getElementById("players")
		);

		expect(document.body.innerHTML).toBe(expectedTable);
	});
});
