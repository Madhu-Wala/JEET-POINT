const multer = require('multer');

// use memory storage to match original single-file behavior
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  upload,
};
