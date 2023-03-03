const storeImgLocally = require('../../config/multer');
const imageKit = require('../../config/imageKit');
const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const fs = require('fs');
const fsPromise = require('fs/promises');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  // upload the image to the cloud
  (req, res, next) => {
    if (!req.file) {
      return next(new BadRequestErr('No file uploaded.'));
    }

    let fileReadStream = fs.createReadStream(req.file.path);
    
    imageKit.upload({
      file: fileReadStream,
      fileName: `admin${req.user.id}`,
      folder: 'admin',
      useUniqueFileName: false // set no unique postfix so if user has already uploaded a photo, it gets overwritten
    })
      .then(async (fileInfo) => {
        fileReadStream.destroy();
        fsPromise.rm(req.file.path);
        prisma.admins.update({
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
