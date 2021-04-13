const mongoose = require("mongoose");
const config = require("config");
const logger = require("../backend/logger");

const dbname = encodeURIComponent(process.env.DBNAME);
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpwd = encodeURIComponent(process.env.DBPWD);
const dbhost = encodeURIComponent(process.env.DBHOST);

let dburi = "";
// if congfig can not be read from environment variables, try config files
if (!dbname || !dbuser || !dbpwd || !dbhost) {
	logger.log({
		level: "info",
		message:
			"Getting DB URI from Environment failed. Falling back to config file",
	});
	dburi = config.get("mongoURI");
} else {
	logger.log({
		level: "info",
		message: "Using env vars to build dburi",
	});
	dburi = `mongodb://${dbuser}:${dbpwd}@${dbhost}/${dbname}`;
}

const db = dburi;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		logger.log({
			level: "info",
			message: "MongoDB is Connected...",
		});
	} catch (err) {
		logger.log({
			level: "error",
			message: err.message,
		});
		process.exit(1);
	}
};

module.exports = connectDB;
