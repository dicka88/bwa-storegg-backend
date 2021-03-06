const { Router } = require("express");
const transactionController = require("../../app/controller/transactionController");

const router = new Router();

router.get('/', transactionController.index);
router.put('/status/:id', transactionController.actionStatus);

module.exports = router;