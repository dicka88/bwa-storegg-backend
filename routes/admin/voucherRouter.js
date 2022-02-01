const { Router } = require("express");
const multer = require("multer");

const voucherController = require("../../app/controller/voucherController");
const config = require("../../config");
const { diskStorage } = require("../../config/multer");

const router = new Router();

const uploadThumbnail = multer({ storage: diskStorage() }).single('thumbnail');

router.get('/', voucherController.index);
router.get('/create', voucherController.viewCreate);
router.post('/create', uploadThumbnail, voucherController.postCreate);
router.get('/:id', voucherController.viewDetail);
router.put('/:id', uploadThumbnail, voucherController.putDetail);
router.delete('/:id', voucherController.deleteVoucher);
router.put('/status/:id', voucherController.updateStatus);

module.exports = router;