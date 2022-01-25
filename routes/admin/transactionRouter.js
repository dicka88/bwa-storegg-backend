const { Router } = require("express");
const transactionController = require("../../app/controller/transactionController");

const router = new Router();

router.get('/', transactionController.index);
router.get('/create', transactionController.viewCreate);
router.post('/create', transactionController.postCreate);
router.get('/:id', transactionController.viewDetail);
router.put('/:id', transactionController.putDetail);

module.exports = router;