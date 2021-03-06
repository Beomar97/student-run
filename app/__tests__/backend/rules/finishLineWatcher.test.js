const FinishLineWatcher = require("../../../backend/rules/finishLineWatcher");
const PlayerDetailsPublisher = require("../../../backend/sync/playerDetailsPublisher");
const GameState = require("../../../public/js/shared/game/gameState");
const { GameObject } = require("../../../public/js/shared/game/gameObject");
const Player = require("../../../public/js/shared/game/player");
const gameObjectTypes = require("../../../public/js/shared/game/gameObjectTypes");
const Room = require("../../../backend/game/room");

const OFFSET = 100;
jest.mock("../../../backend/sync/playerDetailsPublisher");
jest.mock("../../../backend/game/room");

beforeEach(() => {
	PlayerDetailsPublisher.mockClear();
});

describe("Test Finish Line Watcher", () => {
	test("if detects finish line.", () => {
		let finishLinePosition = 50;
		let positionNotDone = { x: 0, y: 1 };
		let positionDone = { x: finishLinePosition, y: 0 };

		let player = new Player(0, {
			position: positionNotDone,
		});
		let finishLine = new GameObject(1, gameObjectTypes.FINISH_LINE, {
			position: positionDone,
		});

		let gameState = new GameState();
		gameState.addAll([player, finishLine]);

		let testee = new FinishLineWatcher(
			new PlayerDetailsPublisher(),
			gameState,
			OFFSET,
			() => {}
		);
		expect(testee.finishLinePosition).toBe(finishLinePosition - OFFSET);
	});

	test("if player is not marked as done.", () => {
		let finishLinePosition = 1000;
		let positionNotDone = { x: 0, y: 0 };
		let positionDone = { x: finishLinePosition, y: 0 };

		let player = new Player(0, {
			position: positionNotDone,
		});
		let finishLine = new GameObject(1, gameObjectTypes.FINISH_LINE, {
			position: positionDone,
		});

		let gameState = new GameState();
		gameState.addAll([player, finishLine]);

		let testee = new FinishLineWatcher(
			new PlayerDetailsPublisher(),
			gameState,
			OFFSET,
			() => {}
		);
		testee.checkFinishLine(gameState);

		expect(player.done).toBe(false);
	});

	test("if player is marked as done.", () => {
		let finishLinePosition = 1000;
		let positionDone = { x: finishLinePosition, y: 0 };

		let player = new Player(0, {
			position: positionDone,
		});
		let finishLine = new GameObject(1, gameObjectTypes.FINISH_LINE, {
			position: positionDone,
		});

		let gameState = new GameState();
		gameState.addAll([player, finishLine]);

		let pdpMock = new PlayerDetailsPublisher();

		let testee = new FinishLineWatcher(
			pdpMock,
			gameState,
			OFFSET,
			() => {}
		);
		testee.checkFinishLine(gameState);

		expect(pdpMock.publish).toHaveBeenCalled();
	});

	test("if gameDone is set to false.", () => {
		let finishLinePosition = 1000;
		let positionDone = { x: finishLinePosition, y: 0 };
		let player = new Player(0, {
			position: positionDone,
		});
		let finishLine = new GameObject(1, gameObjectTypes.FINISH_LINE, {
			position: positionDone,
		});
		let gameState = new GameState();
		gameState.addAll([player, finishLine]);
		let pdpMock = new PlayerDetailsPublisher();

		let testee = new FinishLineWatcher(
			pdpMock,
			gameState,
			OFFSET,
			() => {}
		);
		testee._isGameDone(gameState);
		expect(player.done).toBe(false);
	});

	test("if throws error without finish line.", () => {
		let position = { x: 200, y: 0 };

		let player = new Player(0, {
			position: position,
		});

		let gameState = new GameState();
		gameState.addAll([player]);

		expect(() => {
			new FinishLineWatcher(
				new PlayerDetailsPublisher(),
				gameState,
				OFFSET,
				() => {}
			);
		}).toThrow("Game has no finish line!");
	});
});
