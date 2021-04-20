class GameUpdate {
	constructor(gameState, actions, eventQueue, timeline) {
		this.gameState = gameState;
		this.actions = actions;
		this.eventQueue = eventQueue;
		this.timeline = timeline;
	}

	apply(delta) {
		this.timeline.mayCreateSnapshot();
		this.eventQueue.dispatch(this.gameState.tic);
		this.actions.forEach((action) => action(this.gameState, delta));
	}
}

module.exports = GameUpdate;
