const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const playAdminAuth = require('../../utils/middleware/playAdminAuth');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  playAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('celeb_id not valid.'));
    }

    prisma.celebrities.findUnique({
      where: { id: +req.params.id },
    })
      .then(async (celeb) => {
        if (!celeb) {
          return next(new NotFoundErr('celebrity not found.'));
        }

        if (!celeb.profile_pic_fileId) {
          return next(new BadRequestErr('celebrity has no profile pic.'));
        }

        await imageKit.deleteFile(celeb.profile_pic_fileId);
        await prisma.celebrities.update({
          where: { id: celeb.id },
          data: {
            profile_pic_fileId: null,
            profile_pic_url: null,
          }
        });

        res.end();
      })
      .catch(next);
  }
];

module.exports = controller;