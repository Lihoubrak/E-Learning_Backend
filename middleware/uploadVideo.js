const multer = require('multer');

const FILE_TYPE_MAP = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    const uploadError = new Error('Invalid file type');

    if (isValid) {
      cb(null, 'public/videos');
    } else {
      cb(uploadError, 'public/videos');
    }
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
