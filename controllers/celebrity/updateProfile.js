const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const fs = require('fs');
const fsPromise = require('fs/promises');
const storeImgLocally = require('../../config/multer');
const inputValidator = require('../../utils/inputValidators/updateCeleb');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs')
const playAdminAuth = require('../../utils/middleware/playAdminAuth');
const errorLogger = require('../../utils/errors/errorLogger');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  playAdminAuth,

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  storeValidatedInputs(inputValidator),

  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('celeb_id not valid.'));
    }

    prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })
      .then(async (celeb) => {
        let uploadedFileInfo;

        if (!celeb) {
          return next(new NotFoundErr('celeb not found.'));
        }

        if (req.file) {
          let fileReasStream = fs.createReadStream(req.file.path);
          fileReasStream.on('end', fileReasStream.destroy.bind(fileReasStream));
          uploadedFileInfo = await imageKit.upload({
            file: fileReasStream,
            fileName: `celebPic${celeb.id}`,
            folder: 'celeb',
            useUniqueFileName: false, // no unique postfix, so if there's already a pic of the celeb it would be overwritten
          })
        }

        return { uploadedFileInfo, celeb };
      })
      .then(async ({ uploadedFileInfo, celeb }) => {
        let upCeleb = await prisma.celebrities.update({
          where: { id: celeb.id },
          data: {
            ...res.locals.validBody,
            profile_pic_url: uploadedFileInfo?.filePath,
            profile_pic_fileId: uploadedFileInfo?.fileId,
          }
        });
        
        delete upCeleb.profile_pic_fileId;
        res.json(upCeleb);
      })
      .catch(next)
      .finally(() => {
        if (req.file) {
          fsPromise.rm(req.file.path)
            .catch(errorLogger.bind(null, { title: 'FILE REMOVEL ERROR' }));
        }
      });
  }
];

module.exports = controller;
