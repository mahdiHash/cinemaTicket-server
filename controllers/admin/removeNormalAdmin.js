const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const ForbiddenErr = require('../../utils/errors/forbiddenErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');


const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.adminId)) {
      return next(new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.'));
    }

    let targetAdmin = await prisma.admins.findUnique({
      where: { id: +req.params.adminId },
    })
      .catch(next);

    if (!targetAdmin) {
      return next(new NotFoundErr('ادمین پیدا نشد.'));
    }

    if (targetAdmin.access_level === 'super') {
      return next(new ForbiddenErr('ادمین برتر نمی‌تواند دیگر ادمین‌های برتر را حذف کند.'));
    }

    prisma.admins.delete({
      where: { id: +req.params.adminId },
    })
      .then(() => {
        res.json({
          message: "ادمین با موفقیت حذف شد.",
        })
      })
      .catch(next);
  }
];

module.exports = controller;
