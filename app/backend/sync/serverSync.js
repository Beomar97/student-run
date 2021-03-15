class ServerSync {
	constructor(socket) {
		this.socket = socket;
	}

	getId() {
		return this.socket.id;
	}

	on(id, eventHandler) {
		this.socket.on(id, eventHandler);
	}

	emit(id, object) {
		this.socket.emit(id, object);
	}

	emitAll(id, object) {
		this.socket.broadcast.emit(id, object);
	}
}

module.exports = ServerSync;
