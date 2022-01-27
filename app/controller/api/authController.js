const PlayerModel = require("../../models/PlayerModel");
const bcryptjs = require('bcryptjs');
const config = require("../../../config");

module.exports = {
  async signin(req, res) {
    const { email, password } = req.body;

    const player = await PlayerModel.findOne({ email }).select('+password');

    if (!player) return res.status(404).json({
      message: "Player is not found"
    });

    const passwordMatch = bcryptjs.compareSync(password, player.password);

    if (!passwordMatch) return res.status(400).json({
      message: "Email or password is wrong"
    });

    delete player._doc.password;

    return res.json({
      player
    });
  },
  async signup(req, res) {
    const { name, email, username, password, phoneNumber, favoriteGame } = req.body;

    try {
      const player = await PlayerModel.exists({ username });

      if (player) return res.status(400).send({
        message: "Username has been used by another player"
      });

      let avatar = null;

      if (req.file) {
        avatar = req.file.filename;
      }

      const result = await PlayerModel.create({
        name,
        username,
        email,
        phoneNumber,
        password,
        avatar,
        favoriteGame
      });
      delete result._doc.password;

      res.json({
        message: "Success",
        result
      });
    } catch (e) {
      res.status(500).json({
        message: e.message || "Internal server error"
      });
    }
  }
};