const PlayerModel = require("../../models/PlayerModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../../config");
const { uploader } = require('cloudinary').v2;

module.exports = {
  async signin(req, res) {
    const { email, password } = req.body;

    const player = await PlayerModel.findOne({ email }).select('+password');

    if (!player) return res.status(404).json({
      message: "Player is not found"
    });

    const passwordMatch = bcryptjs.compareSync(password, player.password);

    if (!passwordMatch) return res.status(403).json({
      message: "Email or password is wrong"
    });

    delete player._doc.password;

    const token = jwt.sign({
      id: player._id,
      username: player.username,
      email: player.email,
      name: player.name,
      avatar: player.avatar,
      phoneNumber: player.phoneNumber
    }, config.secretKey);

    return res.json({
      token
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
        const filePath = `public/uploads/${req.file.filename}`;

        const resCloudinary = await uploader.upload(filePath);
        avatar = {
          asset_id: resCloudinary.asset_id,
          public_id: resCloudinary.public_id,
          bytes: resCloudinary.bytes,
          width: resCloudinary.width,
          height: resCloudinary.height,
          format: resCloudinary.format,
          created_at: resCloudinary.created_at,
          url: resCloudinary.url,
          secure_url: resCloudinary.secure_url,
          original_filename: resCloudinary.original_filename,
        };
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
    } catch (err) {
      if (err.name == 'ValidationError') return res.status(422).json({
        message: err.message,
        fields: err.errors
      });

      res.status(500).json({
        message: err.message || "Internal server error"
      });
    }
  }
};