const { Router } = require("express");
const categoryController = require('../../app/controller/categoryController');

const router = new Router();

router.get('/', categoryController.index);
router.get('/create', categoryController.viewCreate);
router.post('/create', categoryController.postCreate);
router.get('/:id', categoryController.viewDetail);
router.put('/:id', categoryController.putDetail);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;