const SKINS = [
	{
		name: "dude",
		file: "assets/sprites/dude.png",
		frameWidth: 32,
		frameHeight: 48,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 3 },
			},
			{
				name: "right",
				frames: { start: 5, end: 8 },
			},
			{
				name: "turn",
				frames: 4,
			},
		],
	},
	{
		name: "snow",
		file: "assets/sprites/snowman.png",
		frameWidth: 128,
		frameHeight: 128,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 6 },
			},
			{
				name: "right",
				frames: { start: 7, end: 14 },
			},
			{
				name: "turn",
				frames: 7,
			},
		],
	},
	{
		name: "happy",
		file: "assets/sprites/happy.png",
		frameWidth: 128,
		frameHeight: 128,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 4 },
			},
			{
				name: "right",
				frames: { start: 6, end: 10 },
			},
			{
				name: "turn",
				frames: 5,
			},
		],
	},
	{
		name: "hat",
		file: "assets/sprites/hat.png",
		frameWidth: 128,
		frameHeight: 88,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 1 },
			},
			{
				name: "right",
				frames: { start: 1, end: 2 },
			},
			{
				name: "turn",
				frames: 1,
			},
		],
	},
	{
		name: "fish",
		file: "assets/sprites/fish.png",
		frameWidth: 128,
		frameHeight: 128,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 1 },
			},
			{
				name: "right",
				frames: { start: 3, end: 4 },
			},
			{
				name: "turn",
				frames: 2,
			},
		],
	},
	{
		name: "vortex",
		file: "assets/sprites/debian.png",
		frameWidth: 128,
		frameHeight: 128,
		anims: [
			{
				name: "left",
				frames: { start: 0, end: 3 },
			},
			{
				name: "right",
				frames: { start: 3, end: 6 },
			},
			{
				name: "turn",
				frames: 3,
			},
		],
	},
];

class Skins {
	constructor() {
		this.shuffledSkins = this._shuffle(SKINS);
		this.skinMap = new Map();
		for (let i = 0; i < SKINS.length; i++) {
			this.skinMap.set(i, SKINS[i]);
		}
	}

	static getSkins() {
		return SKINS;
	}

	getSkinById(id) {
		return this.skinMap.get(id);
	}

	getSkinByName(name) {
		for (let id = 0; id < SKINS.length; id++) {
			if (this.skinMap.get(id).name === name) {
				return this.skinMap.get(id);
			}
		}
	}

	_shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
}
module.exports = Skins;
