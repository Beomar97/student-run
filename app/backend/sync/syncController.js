const socketIo = require("socket.io");
const ServerSync = require("./serverSync");
const events = require("../../public/js/shared/sync/events");

class SyncController {
	constructor(server) {
		this.io = socketIo(server);
		console.log(this.io);
	}

	control(onConnection) {
		this.io.on(events.CONNECTION, (socket) =>
			onConnection(new ServerSync(socket))
		);
	}
}

module.exports = SyncController;
