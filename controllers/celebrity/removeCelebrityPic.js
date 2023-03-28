const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const playAdminAuth = require('../../utils/middleware/playAdminAuth');

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

        let { fileId } = await prisma.celebrity_pics.findUnique({
          where: { url: `/${req.params.folder}/${req.params.fileName}` },
        });

        if (!fileId) {
          return next(new NotFoundErr('pic not found.'));
        }

        await imageKit.deleteFile(fileId);
        await prisma.celebrity_pics.delete({
          where: { url: `/${req.params.folder}/${req.params.fileName}` },
        });

        res.end();
      })
      .catch(next);
  }
];

module.exports = controller;
