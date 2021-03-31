mocks = {
	matter: (callsCallback) => {
		return {
			calls: new Map(),
			Engine: {
				create: () => {
					callsCallback("Engine.create");
					return {};
				},
				update: (engine, time) => callsCallback("Engine.update"),
			},
			Body: {
				setPosition: (object, position) =>
					callsCallback("Body.setPosition"),
			},
		};
	},
	socket: () => {
		return {
			id: 1,
			on: jest.fn((id, object) => {}),
			emit: jest.fn((id, object) => {}),
			broadcast: {
				emit: jest.fn((id, object) => {}),
			},
		};
	},
	util: {
		resetSocketMock: (socket) => {
			socket.on.mockClear();
			socket.emit.mockClear();
			socket.broadcast.emit.mockClear();
		},
	},
};

module.exports = mocks;
