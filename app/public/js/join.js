const $ = require("jquery");
const { io } = require("socket.io-client");
const events = require("./shared/sync/events");
const ClientSync = require("./sync/clientSync");
const RoomUpdateHandler = require("./sync/roomUpdateHandler");
const TableGenerator = require("./helper/tableGenerator");

let clientSync = new ClientSync(io());
let tableGenerator = new TableGenerator();

let roomUpdateHandler = new RoomUpdateHandler(clientSync, tableGenerator);
roomUpdateHandler.init();

$("#joinGame").on("click", function (event) {
	event.preventDefault();

	let name = window.prompt("Your Name", "Mustermann");
	if (name) {
		clientSync.emit(events.PLAYER_JOINED, { name: name });
		$("#joinGame").prop("disabled", true);
	}
});

$("#startGame").on("click", function (event) {
	event.preventDefault();
	clientSync.emit(events.INITIALIZE_GAME);
});
