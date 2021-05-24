class Vector2 {
	scale() {
		return { x: 1, y: 1 };
	}
}

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
			to: jest.fn((client, id, object) => {
				return { emit: jest.fn((id, object) => {}) };
			}),
		};
	},
	updateLock: (isLocked) => {
		return { isLocked: (param1, param2) => isLocked };
	},
	phaser: (distanceTwoPoints) => {
		return {
			add: {
				rectangle: jest.fn((x, y, width, height, color) => {
					return {};
				}),
				sprite: jest.fn((x, y, texture) => {
					return {};
				}),
				tileSprite: jest.fn((x, y, width, height, texture) => {
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
			math: {
				Distance: {
					BetweenPoints: (x, y) => distanceTwoPoints,
				},
				Vector2: Vector2,
			},
			sound: {
				play: jest.fn((sound, config) => {}),
				pauseAll: jest.fn(() => {}),
			},
		};
	},
	localStorage: {
		getItem: jest.fn(),
		setItem: jest.fn(),
		clear: jest.fn(),
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
			phaser.add.tileSprite.mockClear();
			phaser.matter.add.rectangle.mockClear();
			phaser.matter.add.circle.mockClear();
			phaser.matter.add.gameObject.mockClear();
			phaser.sound.play.mockClear();
			phaser.sound.pauseAll.mockClear();
		},
	},
};

module.exports = mocks;
