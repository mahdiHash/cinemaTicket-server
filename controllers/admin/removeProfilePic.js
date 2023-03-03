const prisma = require('../../config/prismaConfig');
const imageKit = require('../../config/imageKit');
const passport = require('passport');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  async (req, res, next) => {
    let { profile_pic_fileId: fileId } = await prisma.admins.findFirst({
      where: { id: req.user.id },
      select: { profile_pic_fileId: true },
    })
      .catch(next);

    if (!fileId) {
      return next(new BadRequestErr('admin has no profile pic.'));
    }

    imageKit.deleteFile(fileId)
      .then(() => {
        prisma.admins.update({
          where: { id: req.user.id },
          data: {
            profile_pic_fileId: null,
            profile_pic_url: null,
          }
        })
          .then(() => res.end())
          .catch(next);
      })
      .catch(next);
  }
];

module.exports = controller;
