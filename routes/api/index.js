const { Router } = require("express");
const path = require('path');
const multer = require("multer");
const authController = require("../../app/controller/api/authController");
const playerController = require("../../app/controller/api/playerController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/avatar');
  },
  filename: function (req, file, cb) {
    const pathFile = path.parse(file.originalname);
    const ext = pathFile.ext;

    const filename = `${Date.now()}${ext}`;

    cb(null, filename);
  }
});

const multerAvatar = multer({ storage }).single('avatar');

const router = new Router();

router.use('/v1', (() => {
  const router = new Router();

  router.post('/auth/signin', authController.signin);
  router.post('/auth/signup', multerAvatar, authController.signup);

  router.get('/player/landingpage', playerController.landingPage);
  router.get('/player/detail/:id', playerController.detailPage);
  router.get('/player/category', playerController.category);

  return router;
})());


module.exports = router;