const Matter = require("matter-js");
const Physics = require("../physics/physics");
const physics = new Physics(Matter);
const LevelLoader = require("../game/levelLoader");
const levelLoader = new LevelLoader("../../public/js/shared/levels/", physics);

exports.getById = (req, res) => {
	res.send(levelLoader.getLevelJSONById(req.params.id));
};

exports.getAll = (req, res) => {
	res.send(Object.values(levelLoader.levelCollection));
};
