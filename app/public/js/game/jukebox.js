class Jukebox {
	constructor(sound) {
		this.sound = sound;
		this.volume = 0.1;
	}

	playDone() {
		this._pauseAll();
		this.sound.play("done_audio", {
			volume: this.volume,
			loop: false,
		});
	}

	playSoundTrack() {
		this.sound.play("level_audio", {
			volume: this.volume,
			loop: true,
		});
	}

	_pauseAll() {
		this.sound.pauseAll();
	}
}

module.exports = Jukebox;
