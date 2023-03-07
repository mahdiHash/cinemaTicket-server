const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const imageKit = require('../../config/imageKit');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.userId)) {
      return next(new BadRequestErr('user_id is not valid.'));
    }

    let user = await prisma.users.findUnique({
      where: { id: +req.params.userId },
      select: {
        id: true,
        profile_pic_fileId: true,
      }
    })
      .catch(next);

    if (!user) {
      return next(new NotFoundErr("user not found"));
    }

    imageKit.deleteFile(user.profile_pic_fileId)
      .then(async () => {
        await prisma.users.update({
          where: { id: user.id },
          data: {
            profile_pic_fileId: null,
            profile_pic_url: null,
          }
        })
        .catch(next);
      })
      .then(() => res.end())
      .catch(next);
  }
];

module.exports = controller;
