const multer = require('multer');
const path = require('path');

const memoryStorage = multer.memoryStorage();

const defaultDiskStorageParam = {
  dir: 'public/uploads'
};
const diskStorage = (param = {}) => {
  param = Object.assign(defaultDiskStorageParam, param);

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, param.dir);
    },
    filename: function (req, file, cb) {
      const pathFile = path.parse(file.originalname);
      const name = pathFile.name;
      const ext = pathFile.ext;

      const filename = `${name}-${Date.now()}${ext}`;

      cb(null, filename);
    }
  });
};

module.exports = {
  memoryStorage,
  diskStorage
};