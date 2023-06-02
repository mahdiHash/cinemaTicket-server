const prisma = require('../../config/prismaConfig');
const imageKit = require('../../config/imageKit');
const passport = require('../../config/passportConfig');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  // delete user's profile pic from cloud storage
  async (req, res, next) => {
    let fileId = await prisma.users.findUnique({ where: { id: req.user.id } })
      .then((user) => user.profile_pic_fileId)
      .catch(next);

    if (fileId === null) {
      return next(new BadRequestErr('کاربر عکس پروفایل ندارد.'));
    }

    imageKit.deleteFile(fileId)
      .then(() => {
        prisma.users.update({
          where: { id: req.user.id },
          data: {
            profile_pic_fileId: null,
            profile_pic_url: null,
          }
        })
          .then(() => {
            res.json({
              message: "عکس پروفایل حذف شذ."
            });
          })
          .catch(next);
      })
      .catch(next);
  }
];

module.exports = controller;
