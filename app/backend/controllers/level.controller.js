const LevelLoader = require("../game/levelLoader");
const LevelHolder = require("../game/levelHolder");
const levelHolder = new LevelHolder(
	"../../public/js/shared/levels/",
	new LevelLoader()
);

exports.getById = (req, res) => {
	res.send(levelHolder.getLevelJSONById(req.params.id));
};

exports.getAll = (req, res) => {
	res.send(Object.values(levelHolder.levelCollection));
};
