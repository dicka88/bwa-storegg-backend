const { Router } = require("express");
const dashboardController = require('../../app/controller/dashboardController');

const router = new Router();

router.get('/', dashboardController.index);

module.exports = router;