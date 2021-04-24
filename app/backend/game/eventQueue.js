const SortedList = require("sortedlist");
const logger = require("../logger");

class EventQueue {
	constructor(maxEntries) {
		this.maxEntries = maxEntries;
		this.events = new Map();
		this.eventKeysOrdered = SortedList.create();
		this.ticOfOldestEvent = null;
	}

	enqueue(tic, event) {
		let eventsOfTic = this.events.get(tic);
		if (eventsOfTic) {
			eventsOfTic.push(event);
		} else {
			this.events.set(tic, [event]);
			this.eventKeysOrdered.insertOne(tic);
			if (this.events.size > this.maxEntries) {
				this.events.delete(this.eventKeysOrdered.shift());
			}
		}

		if (this.ticOfOldestEvent === null || tic < this.ticOfOldestEvent) {
			this.ticOfOldestEvent = tic;
		}
	}

	resetTicOfOldestEvent() {
		this.ticOfOldestEvent = null;
	}

	dispatch(tic) {
		if (tic < this.eventKeysOrdered[0]) {
			logger.warn({
				message: "tic is older than oldest cached event.",
				givenTic: tic,
				ticOfOldesEvent: this.eventKeysOrdered[0],
			});
		}
		if (this.events.has(tic)) {
			this.events.get(tic).forEach((event) => event());
		}
	}
}

module.exports = EventQueue;
