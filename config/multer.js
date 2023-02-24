const os = require('os');
const path = require('path');
const BadRequestErr = require('../utils/errors/badRequestErr');
const multer = require('multer');
const disk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    let name =
      'cinemaTicket' + Date.now() + Math.floor(Math.random() * 1e6) + path.extname(file.originalname);

    cb(null, name);
  }
});

const upload = multer({
  storage: disk,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: (req, file, cb) => {
    let validForamts = ['.jpg', '.jpeg', '.png', '.webp'];
    let fileFormat = path.extname(file.originalname).toLocaleLowerCase();

    if (!validForamts.includes(fileFormat)) {
      cb(new BadRequestErr('file format not valid.'));
    }
    else {
      cb(null, true);
    }
  }
});

module.exports = upload;
