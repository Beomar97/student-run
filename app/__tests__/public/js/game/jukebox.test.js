const Jukebox = require("../../../../public/js/game/jukebox");
const mocks = require("../../../mocks/mocks");

let phaser = mocks.phaser();

beforeEach(() => {
	mocks.util.resetPhaserMock(phaser);
});

describe("Test the Jukebox class", () => {
	test("if Jukebox plays done sound correctly", () => {
		let testee = new Jukebox(phaser.sound);
		testee.playDone();
		expect(phaser.sound.play).toHaveBeenCalledWith("done_audio", {
			loop: false,
			volume: 0.1,
		});
		expect(phaser.sound.pauseAll).toHaveBeenCalled();
	});

	test("if Jukebox plays soundtrack correctly", () => {
		let testee = new Jukebox(phaser.sound);
		testee.playSoundTrack();
		expect(phaser.sound.play).toHaveBeenCalledWith("level_audio", {
			loop: true,
			volume: 0.1,
		});
	});
});
