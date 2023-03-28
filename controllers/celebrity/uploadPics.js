const storeImagesLocally = require('../../config/multer');
const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const fs = require('fs');
const fsPromise = require('fs/promises');
const playAdminAuth = require('../../utils/middleware/playAdminAuth');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const errLogger = require('../../utils/errors/errorLogger');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  playAdminAuth,

  storeImagesLocally.array('imgs'),

  async (req, res, next) => {
    let uploadedImgsUrls = [];

    if (!req.files) {
      return next(new BadRequestErr('no image is provided.'));
    }

    if (!isFinite(req.params.id)) {
      req.files.forEach((file) => {
        fsPromise.rm(file.path)
          .catch(errLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));
      })

      return next(new BadRequestErr('celeb_id not valid.'));
    }

    prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })
      .then(async (celeb) => {
        if (!celeb) {
          throw new NotFoundErr('celebrity not found.');
        }

        await Promise.all(req.files.map((file) => {
          let fileReadStream = fs.createReadStream(file.path);
          return imageKit.upload({
            file: fileReadStream,
            fileName: `celebPic${celeb.id}`,
            folder: 'celebpics',
          })
            .then(async (fileInfo) => {
              await prisma.celebrity_pics.create({
                data: {
                  url: fileInfo.filePath,
                  fileId: fileInfo.fileId,
                  celebrity_id: celeb.id,
                }
              })
              uploadedImgsUrls.push(fileInfo.filePath);
            })
            .finally(() => {
              fileReadStream.destroy();
            })
        }))

        res.json(uploadedImgsUrls);
      })
      .finally(() => {
        req.files.forEach((file) => {
          fsPromise.rm(file.path)
            .catch(errLogger.bind(null, { title: 'FILE REMOVAL ERROR' }));
        });
      })
      .catch(next);
  }
];

module.exports = controller;
