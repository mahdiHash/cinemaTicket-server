import { Request } from 'express';
import { tmpdir } from 'os';
import { extname } from 'path';
import { BadRequestErr } from '../helpers/errors';
import multer = require('multer');

const disk = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, tmpdir());
  },
  filename: (req: Request, file, cb) => {
    let name =
      'cinemaTicket' +
      Date.now() +
      Math.floor(Math.random() * 1e6) +
      extname(file.originalname);

    cb(null, name);
  },
});

const upload = multer({
  storage: disk,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req: Request, file, cb: multer.FileFilterCallback) => {
    let validForamts = ['.mp4', '.webm'];
    let fileFormat = extname(file.originalname).toLocaleLowerCase();

    if (!validForamts.includes(fileFormat)) {
      cb(new BadRequestErr('فرمت ویدیوی آپلود شده معتبر نیست.'));
    } else {
      cb(null, true);
    }
  },
});

export { upload as storeVideoLocally };
