mocks = {
	matter: () => {
		return {
			Engine: {
				create: jest.fn(() => {
					return { world: {} };
				}),
				update: jest.fn((engine, time) => {}),
			},
			Body: {
				setPosition: jest.fn((object, position) => {}),
				setVelocity: jest.fn((object, velocity) => {}),
			},
			engine: {
				create: jest.fn(() => {}),
				update: jest.fn((engine, time) => {}),
			},
			body: {
				setPosition: jest.fn((object, position) => {}),
				setVelocity: jest.fn((object, velocity) => {}),
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
	updateLock: (isLocked) => {
		return { isLocked: (param1, param2) => isLocked };
	},
	util: {
		resetMatterMock: (matter) => {
			matter.Engine.create.mockClear();
			matter.Engine.update.mockClear();
			matter.engine.create.mockClear();
			matter.engine.update.mockClear();
			matter.Body.setPosition.mockClear();
			matter.body.setPosition.mockClear();
		},
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
