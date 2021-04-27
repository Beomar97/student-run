const safeStringify = require("fast-safe-stringify");
const roomManger = require("../game/roomManager");

exports.getAll = (req, res) => {
	let room = roomManger.getRoom(0);
	res.send(safeStringify(room.waitingPlayers));
};
