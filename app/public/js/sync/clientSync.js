class ClientSync {
	constructor(io) {
		this.socket = io;
	}

	on(id, eventHandler) {
		this.socket.on(id, eventHandler);
	}

	emit(id, object) {
		this.socket.emit(id, object);
	}
}
