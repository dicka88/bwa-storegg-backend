const { Router } = require("express");
const path = require('path');
const multer = require("multer");
const authController = require("../../app/controller/api/authController");
const playerController = require("../../app/controller/api/playerController");
const authMiddleware = require("../../app/middleware/authMiddleware");

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
  router.post('/player/checkout', authMiddleware.jwtAuth, playerController.checkout);
  router.get('/player/dashboard', authMiddleware.jwtAuth, playerController.dashboard);
  router.get('/player/history', authMiddleware.jwtAuth, playerController.history);
  router.get('/player/history/:id/detail', authMiddleware.jwtAuth, playerController.historyDetail);
  router.get('/player/profile', authMiddleware.jwtAuth, playerController.profile);
  router.put('/player/profile', authMiddleware.jwtAuth, playerController.putProfile);

  return router;
})());


module.exports = router;