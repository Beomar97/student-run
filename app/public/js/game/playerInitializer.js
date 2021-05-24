const Player = require("../shared/game/player");
const physicalConstant = require("../shared/physics/physicalConstant");
const Skins = require("./skins");
const playerColors = require("../helper/playerColors");

class PlayerInitializer {
	constructor(game) {
		this.game = game;
	}

	addJSONObjectsToPhaser(playerData) {
		let players = [];

		playerData.forEach((player) => {
			let phaserPlayer = this._createPhaserPlayer(player);
			let matterPlayer = this._createMatterPlayer();

			this.game.matter.add.gameObject(phaserPlayer, matterPlayer);

			let newPlayer = new Player(
				player.id,
				matterPlayer,
				physicalConstant.BASE_FORCE
			);

			newPlayer.skin = player.skin;
			players.push(newPlayer);
		});

		return players;
	}

	_createPhaserPlayer(player, skinsEnabled) {
		let skins = new Skins();
		if (skinsEnabled) {
			player.skin = skins.getSkinById(player.id);
		} else {
			player.skin = skins.getSkinByName("dude");
		}
		let phaserPlayer = this.game.add.sprite(
			physicalConstant.PLAYER_SPAWN_X,
			physicalConstant.PLAYER_SPAWN_Y,
			player.skin.name
		);

		if (!skinsEnabled) {
			phaserPlayer.tint = playerColors[player.id % playerColors.length];
		}

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
}

module.exports = PlayerInitializer;
