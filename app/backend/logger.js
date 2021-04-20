const Winston = require("winston");

const logger = Winston.createLogger({
	level: process.env.LOGLEVEL || "info",
	format: Winston.format.combine(
		Winston.format.timestamp(),
		Winston.format.prettyPrint()
	),
	transports: [
		new Winston.transports.File({
			filename: "./logs/error.log",
			level: "error",
		}),
		new Winston.transports.File({
			filename: "./logs/combined.log",
		}),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new Winston.transports.Console({
			format: Winston.format.simple(),
		})
	);
}

logger.log({
	level: "info",
	message: "Logger initialization completed",
});

module.exports = logger;
