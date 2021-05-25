const ServerSync = require("./serverSync");
const events = require("../../public/js/shared/sync/events");
const logger = require("../logger");

class SyncController {
	constructor(io) {
		this.io = io;
		this.currentServerSyncs = new Map();
		this.onConnections = new Map();
	}

	init() {
		this.io.on(events.CONNECTION, (socket) => {
			let serverSync = new ServerSync(socket);
			this.currentServerSyncs.set(serverSync.getId(), serverSync);
			this._removeServerSyncOnDisconnect(serverSync);
			this.onConnections.forEach((onConnection) =>
				onConnection(serverSync)
			);

			logger.info({
				message: "Connection established",
				id: serverSync.getId(),
			});
		});
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

	control(onConnection, callerName) {
		this.onConnections.set(callerName, onConnection);
		this.currentServerSyncs.forEach(onConnection);
	}

	uncontrol(callerName) {
		this.onConnections.delete(callerName);
	}

	emit(id, object) {
		this.io.emit(id, object);
	}

	to(id, client, object) {
		this.io.to(client).emit(id, object);
	}
}

module.exports = SyncController;
