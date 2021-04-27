const { Player } = require("./shared/game/gameObject");
const gameObjectTypes = require("./shared/game/gameObjectTypes");

class PlayerInitializer {
	constructor(game) {
		this.game = game;
		this.phaserPlayerCollection = new Map();
		this.matterPlayerCollection = new Map();
	}

	addJSONObjectsToPhaser(playerData) {
		let objectCollection = [];

		playerData.forEach((player) => {
			let phaserPlayer = this.game.add.sprite(300, 300, "player");
			this.phaserPlayerCollection.set(player.id, phaserPlayer);

			let matterPlayer = this.game.matter.add.circle(300, 300, 25, {
				frictionAir: 0.3,
			});
			this.game.matter.add.gameObject(phaserPlayer, matterPlayer);
			let newPlayer = new Player(
				player.id,
				gameObjectTypes.PLAYER,
				matterPlayer,
				0.005
			);
			objectCollection.push(newPlayer);
		});

		return objectCollection;
	}

	getPlayerById(id) {
		return this.phaserPlayerCollection.get(id);
	}
}

module.exports = PlayerInitializer;
