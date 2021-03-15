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
};

module.exports = mocks;
