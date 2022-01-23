const { Router } = require("express");
const paymentController = require("../../app/controller/paymentController");

const router = new Router();

router.get('/', paymentController.index);
router.get('/create', paymentController.viewCreate);
router.post('/create', paymentController.postCreate);
router.get('/:id', paymentController.viewDetail);
router.put('/:id', paymentController.putDetail);
router.delete('/:id', paymentController.deletePayment);
router.put('/status/:id', paymentController.updateStatus);


module.exports = router;