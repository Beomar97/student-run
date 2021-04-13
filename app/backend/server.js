const server = require("./app");
const logger = require("./logger");

const port = process.env.PORT || 8082;

server.listen(port, () =>
	logger.log({
		level: "info",
		message: `Server running on port ${port}`,
	})
);
