const { Router } = require("express");
const playerController = require("../../app/controller/api/playerController");

const router = new Router();

router.use('/v1', (() => {
  const router = new Router();

  router.get('/player/landingpage', playerController.landingPage);

  return router;
})());


module.exports = router;