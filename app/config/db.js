const mongoose = require("mongoose");
const config = require("config");

const dbname = encodeURIComponent(process.env.DBNAME);
const dbuser = encodeURIComponent(process.env.DBUSER);
const dbpwd = encodeURIComponent(process.env.DBPWD);
const dbhost = encodeURIComponent(process.env.DBHOST);

let dburi = "";
// if congfig can not be read from environment variables, try config files
if (!dbname || !dbuser || !dbpwd || !dbhost) {
	console.log(
		"Getting DB URI from Environment failed. Falling back to config file"
	);
	dburi = config.get("mongoURI");
} else {
	console.log("Using env vars to build dburi");
	dburi = `mongodb://${dbuser}:${dbpwd}@${dbhost}/${dbname}`;
}

const db = dburi;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("MongoDB is Connected...");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
