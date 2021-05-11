const PhysicsUpdater = require("../../../../../public/js/shared/physics/physicsUpdater");

describe("Test the PhysicsUpdater class", () => {
	test("if update method calls update and updates gameState correctly.", () => {
		let startingTic = 40;
		let startingLastTicTime = 1000;
		let nrOfTicsToUpdate = 10;
		let gameState = {
			tic: startingTic,
			lastTicTime: startingLastTicTime,
		};
		let milisPerTic = 25;

		let ticToMilisPerTic = new Map();
		for (let i = 0; i <= nrOfTicsToUpdate; i++) {
			ticToMilisPerTic.set(
				startingTic + i,
				startingLastTicTime + i * milisPerTic
			);
		}

		let expectTicAndlastTicTime = (delta) => {
			expect(delta).toEqual(milisPerTic);
			expect(gameState.lastTicTime).toEqual(
				ticToMilisPerTic.get(gameState.tic)
			);
		};

		let testee = new PhysicsUpdater(
			gameState,
			expectTicAndlastTicTime,
			milisPerTic
		);

		testee.update(startingLastTicTime + nrOfTicsToUpdate * milisPerTic + 7);

		expect(gameState.tic).toEqual(startingTic + nrOfTicsToUpdate);
		expect(gameState.lastTicTime).toEqual(
			startingLastTicTime + nrOfTicsToUpdate * milisPerTic
		);
	});
});
