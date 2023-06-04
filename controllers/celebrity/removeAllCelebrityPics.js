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
      return next(new BadRequestErr('پارامتر id باید یک عدد باشد.'));
    }

    prisma.celebrity_pics.findMany({
      where: { celebrity_id: +req.params.id },
    })
      .then(async (pics) => {
        if (!pics.length) {
          return next(new NotFoundErr('عکسی آپلود نشده است.'));
        }

        await Promise.all(pics.map(({ url, fileId }) => {
          return imageKit.deleteFile(fileId)
            .then(() => prisma.celebrity_pics.delete({ where: { url } }));
        }));

        res.json({
          message: "تمام تصاویر هنرمند حذف شدند."
        });
      })
      .catch(next);
  }
];

module.exports = controller;
