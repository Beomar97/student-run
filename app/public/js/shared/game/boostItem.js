const gameObjectTypes = require("./gameObjectTypes");
const Item = require("./item");

class BoostItem extends Item {
	constructor(id, innerObject) {
		super(id, gameObjectTypes.BOOST_ITEM, innerObject);
	}

	applyToPlayer(player) {
		player.innerObject.positionImpulse.x = 100;
		player.innerObject.positionImpulse.y = -20;
	}
}

module.exports = BoostItem;
