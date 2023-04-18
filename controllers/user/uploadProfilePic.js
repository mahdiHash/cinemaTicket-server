const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const imageKit = require('../../config/imageKit');
const fs = require('fs');
const fsPromise = require('fs/promises');
const storeImgLocally = require('../../config/multer');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  // upload the image to cloud
  (req, res, next) => {
    if (!req.file) {
      return next(new BadRequestErr('فایلی آپلود نشده است.'));
    }

    let fileReadStream = fs.createReadStream(req.file.path);
    imageKit.upload({
      file: fileReadStream,
      fileName: `userPic${req.user.id}`,
      folder: 'user',
      useUniqueFileName: false, // set no unique postfix so if user has already uploaded a photo, it gets overwritten
    })
      .then(async (fileInfo) => {
        fileReadStream.destroy();
        fsPromise.rm(req.file.path);
        prisma.users.update({
          where: { id: req.user.id },
          data: {
            profile_pic_fileId: fileInfo.fileId,
            profile_pic_url: fileInfo.filePath,
          }
        })
          .then(() => {
            res.json(fileInfo.filePath);
          })
          .catch(next);
      })
      .catch((err) => {
        fsPromise.rm(req.file.path)
          .then(() => next(err))
          .catch(next);
      });
  }
];

module.exports = controller;
