const Player = require("../shared/game/player");
const physicalConstant = require("../shared/physics/physicalConstant");
const Skins = require("./skins");

class PlayerInitializer {
	constructor(game) {
		this.game = game;
		this.phaserPlayerCollection = new Map();
		this.matterPlayerCollection = new Map();
	}

	addJSONObjectsToPhaser(playerData) {
		let objectCollection = [];

		playerData.forEach((player) => {
			let phaserPlayer = this._createPhaserPlayer(player);
			this.phaserPlayerCollection.set(player.id, phaserPlayer);

			let matterPlayer = this._createMatterPlayer();
			this.matterPlayerCollection.set(player.id, matterPlayer);

			this.game.matter.add.gameObject(phaserPlayer, matterPlayer);

			let newPlayer = new Player(
				player.id,
				matterPlayer,
				physicalConstant.BASE_FORCE
			);

			newPlayer.skin = player.skin
			objectCollection.push(newPlayer);
		});

		return objectCollection;
	}

	_createPhaserPlayer(player) {
		let skins = new Skins();
		player.skin = skins.getSkinById(player.id);
		let phaserPlayer = this.game.add.sprite(
			physicalConstant.PLAYER_SPAWN_X,
			physicalConstant.PLAYER_SPAWN_Y,
			player.skin.name,
		);

		console.error(phaserPlayer)
		if (player.skin.name !== "dude") {
			phaserPlayer.setScale(0.375);
		}

		return phaserPlayer;
	}

	_createMatterPlayer() {
		return this.game.matter.add.circle(
			physicalConstant.PLAYER_SPAWN_X,
			physicalConstant.PLAYER_SPAWN_Y,
			physicalConstant.PLAYER_SIZE,
			{
				frictionAir: physicalConstant.FRICTION_AIR,
				inertia: Infinity,
			}
		);
	}

	getPhaserPlayerById(id) {
		return this.phaserPlayerCollection.get(id);
	}
}

module.exports = PlayerInitializer;
