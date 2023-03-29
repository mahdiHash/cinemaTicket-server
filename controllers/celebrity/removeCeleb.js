const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const ForbiddenErr = require('../../utils/errors/forbiddenErr');
const playAdminAuth = require('../../utils/middleware/playAdminAuth');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  playAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('celeb_id not valid.'));
    }

    let celebMovie = await prisma.play_celebrities.findFirst({
      where: { celebrity_Id: +req.params.id },
    })
      .catch(next);

    if (celebMovie) {
      return next(new ForbiddenErr('celebrity is casting in a play. you need to remove the play first.'));
    }

    let celebPics = await prisma.celebrity_pics.findMany({
      where: { celebrity_id: +req.params.id },
    })
      .catch(next);

    await Promise.all(celebPics.map(({ url, fileId }) => {
      return imageKit.deleteFile(fileId)
        .then(() => prisma.celebrity_pics.delete({ where: { url } }));
    }))
      .then(() => {
        return prisma.celebrities.delete({ where: { id: +req.params.id }});
      })
      .catch(next);

    res.end();
  }
];

module.exports = controller;
