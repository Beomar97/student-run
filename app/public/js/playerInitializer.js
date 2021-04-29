const { Player } = require("./shared/game/gameObject");
const gameObjectTypes = require("./shared/game/gameObjectTypes");
const physicalConstant = require("./shared/physics/physicalConstant");
const playerColors = require("./helper/playerColors");

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
				gameObjectTypes.PLAYER,
				matterPlayer,
				physicalConstant.BASE_FORCE
			);

			objectCollection.push(newPlayer);
		});

		return objectCollection;
	}

	_createPhaserPlayer(player) {
		let phaserPlayer = this.game.add.sprite(
			physicalConstant.PLAYER_SPAWN_X,
			physicalConstant.PLAYER_SPAWN_Y,
			"player"
		);

		phaserPlayer.tint = playerColors[player.id % playerColors.length];

		return phaserPlayer;
	}

	_createMatterPlayer() {
		return this.game.matter.add.circle(
			physicalConstant.PLAYER_SPAWN_X,
			physicalConstant.PLAYER_SPAWN_Y,
			physicalConstant.PLAYER_SIZE,
			{
				frictionAir: physicalConstant.FRICTION_AIR,
			}
		);
	}

	getPhaserPlayerById(id) {
		return this.phaserPlayerCollection.get(id);
	}
}

module.exports = PlayerInitializer;
