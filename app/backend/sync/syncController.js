const ServerSync = require("./serverSync");
const events = require("../../public/js/shared/sync/events");

class SyncController {
	constructor(io) {
		this.io = io;
	}

	control(onConnection) {
		this.io.on(events.CONNECTION, (socket) =>
			onConnection(new ServerSync(socket))
		);
	}

	emit(id, object) {
		this.io.emit(id, object);
	}
}

module.exports = SyncController;
