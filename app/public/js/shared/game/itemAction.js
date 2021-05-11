const gameObjectTypes = require("./gameObjectTypes");

class ItemAction {
	constructor(physics) {
		this.physics = physics;
	}

	run(gameState) {
		gameState.forEachGameObject(
			(gameObject) => this._applyItem(gameObject),
			(gameObject) => {
				return (
					gameObject.type === gameObjectTypes.PLAYER &&
					gameObject.item &&
					gameObject.item.consumed === false
				);
			}
		);
	}

	_applyItem(player) {
		player.item.applyToPlayer(player);
		player.item.consumed = true;
	}
}

module.exports = ItemAction;
