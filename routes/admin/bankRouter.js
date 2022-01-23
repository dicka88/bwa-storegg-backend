const { Router } = require("express");
const bankController = require("../../app/controller/bankController");

const router = new Router();

router.get('/', bankController.index);
router.get('/create', bankController.viewCreate);
router.post('/create', bankController.postCreate);
router.get('/:id', bankController.viewDetail);
router.put('/:id', bankController.putDetail);
router.delete('/:id', bankController.deleteBank);

module.exports = router;