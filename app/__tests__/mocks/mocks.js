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
		resetPhaserMock: (phaser) => {
			phaser.add.rectangle.mockClear();
			phaser.add.sprite.mockClear();
			phaser.matter.add.rectangle.mockClear();
			phaser.matter.add.circle.mockClear();
			phaser.matter.add.gameObject.mockClear();
		},
	},
	phaser: {
		add: {
			rectangle: jest.fn((x, y, width, height, color) => {
				return {};
			}),
			sprite: jest.fn((x, y, texture) => {
				return {};
			}),
		},
		matter: {
			add: {
				rectangle: jest.fn((x, y, width, height, color) => {
					return {};
				}),
				circle: jest.fn((x, y, radius) => {
					return {};
				}),
				gameObject: jest.fn((phaserObject, matterObject) => {}),
			},
		},
	},
};

module.exports = mocks;
