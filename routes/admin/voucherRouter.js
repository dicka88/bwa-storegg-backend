const { Router } = require("express");
const multer = require("multer");
const { default: slugify } = require("slugify");
const path = require('path');

const voucherController = require("../../app/controller/voucherController");

const router = new Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
    const pathFile = path.parse(file.originalname);
    const name = pathFile.name;
    const ext = pathFile.ext;

    const filename = `${name}-${Date.now()}${ext}`;

    cb(null, filename);
  }
});

const uploadThumbnail = multer({ storage }).single('thumbnail');

router.get('/', voucherController.index);
router.get('/create', voucherController.viewCreate);
router.post('/create', uploadThumbnail, voucherController.postCreate);
router.get('/:id', voucherController.viewDetail);
router.put('/:id', uploadThumbnail, voucherController.putDetail);
router.delete('/:id', voucherController.deleteVoucher);
router.put('/status/:id', voucherController.updateStatus);

module.exports = router;