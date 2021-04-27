$(function () {
	let clientSync = new ClientSync(io());

	$("#joinGame").click(function (event) {
		event.preventDefault();

		let name = window.prompt("Your Name", "Mustermann");
		clientSync.emit(events.PLAYER_JOINED, { name: name });
	});

	$("#startGame").click(function (event) {
		event.preventDefault();
		clientSync.emit(events.INITIALIZE_GAME);
	});

	clientSync.on(events.ROOM_STATE_UPATE, (roomUpdate) => {
		let waitingPlayers = JSON.parse(roomUpdate.waitingPlayers);
		TableGenerator.generate(
			["id", "name"],
			waitingPlayers,
			document.getElementById("players")
		);
	});

	clientSync.on(events.PLAYER_JOINED, (newId) => {
		localStorage.setItem("playerId", newId.playerId);
	});

	clientSync.on(events.GAME_READY, () => {
		window.location = "/game.html";
	});
});
