let eventHandlers = {
	handleMovementChangeEvent: (gameState, movementChangeEvent) => {
		let player = gameState.getGameObject(movementChangeEvent.id);
		player.setDirectionX(movementChangeEvent.directionX);
	},
	handleJumpEvent: (gameState, jumpEvent) => {
		let player = gameState.getGameObject(jumpEvent.id);
		player.setDirectionY(1);
	},
	handleItemEvent: (gameState, itemEvent, deleteInnerObject) => {
		let player = gameState.getGameObject(itemEvent.playerId);
		let item = gameState.getGameObject(itemEvent.itemId);
		player.item = item;
		deleteInnerObject(item.innerObject);
		gameState.removeGameObject(item.id);
	},
};

module.exports = eventHandlers;
