class RoomManager {
	constructor() {
		this.rooms = new Map();
	}

	addRoom(room) {
		let roomId = this.rooms.size;
		this.rooms.set(roomId, room);
		return roomId;
	}

	getRoom(roomId) {
		return this.rooms.get(roomId);
	}
}

module.exports = new RoomManager();
