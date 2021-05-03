const ServerSync = require("./serverSync");
const events = require("../../public/js/shared/sync/events");
const logger = require("../logger");

class SyncController {
	constructor(io) {
		this.io = io;
		this.currentServerSyncs = new Map();
	}

	control(onConnection) {
		this.io.on(events.CONNECTION, (socket) => {
			let serverSync = new ServerSync(socket);
			this.currentServerSyncs.set(serverSync.getId(), serverSync);
			this._removeServerSyncOnDisconnect(serverSync);
			onConnection(serverSync);

			logger.info({
				message: "Connection established",
				id: serverSync.getId(),
			});
		});
		this.currentServerSyncs.forEach(onConnection);
	}

	_removeServerSyncOnDisconnect(serverSync) {
		serverSync.on(events.DISCONNECT, () => {
			this.currentServerSyncs.delete(serverSync.getId());
			logger.info({
				message: "Disconnected socket",
				id: serverSync.getId(),
			});
		});
	}

	emit(id, object) {
		this.io.emit(id, object);
	}

	to(id, client, object) {
		this.io.to(client).emit(id, object);
	}
}

module.exports = SyncController;
