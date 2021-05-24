const $ = require("jquery");
const { io } = require("socket.io-client");
const events = require("./shared/sync/events");
const ClientSync = require("./sync/clientSync");
const RoomUpdateHandler = require("./sync/roomUpdateHandler");
const JoinViewController = require("./view/joinViewController");

let clientSync = new ClientSync(io());
let joinViewController = new JoinViewController();

let roomUpdateHandler = new RoomUpdateHandler(clientSync, joinViewController);
roomUpdateHandler.init();

$("#joinGame").on("click", function (event) {
	event.preventDefault();

	let name = window.prompt("Your Name", "Mustermann");
	if (name) {
		clientSync.emit(events.PLAYER_JOINED, { name: name });
		joinViewController.disableJoinButton();
	}
});

$("#startGame").on("click", function (event) {
	event.preventDefault();
	clientSync.emit(events.INITIALIZE_GAME);
});
