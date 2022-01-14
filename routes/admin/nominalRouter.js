const { Router } = require("express");
const nominalController = require("../../app/controller/nominalController");

const router = new Router();

router.get('/', nominalController.index);
router.get('/create', nominalController.viewCreate);
router.post('/create', nominalController.postCreate);
router.get('/:id', nominalController.viewDetail);
router.put('/:id', nominalController.putDetail);
router.delete('/:id', nominalController.deleteNominal);

module.exports = router;