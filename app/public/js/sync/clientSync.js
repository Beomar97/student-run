class ClientSync {
	constructor(io) {
		this.socket = io;
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
}

module.exports = ClientSync;
