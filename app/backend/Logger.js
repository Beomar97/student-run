const Winston = require("winston");

const logger = Winston.createLogger({
	level: process.env.LOGLEVEL || "info",
	format: Winston.format.combine(
		Winston.format.timestamp(),
		Winston.format.prettyPrint()
	),
	transports: [new Winston.transports.File({ filename: "combined.log" })],
});

logger.log({
	level: "info",
	message: "Logger initialization completed",
});

module.exports = logger;
