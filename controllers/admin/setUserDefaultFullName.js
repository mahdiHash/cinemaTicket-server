const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const NotFoundErr = require('../../utils/errors/notFoundErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.userId)) {
      return next(new BadRequestErr('شناسۀ کاربر باید یک عدد باشد.'));
    }

    let user = await prisma.users.findUnique({
      where: { id: +req.params.userId },
      select: { full_name: true, id: true },
    })
      .catch(next);

    if (!user) {
      return next(new NotFoundErr('کاربر پیدا نشد.'));
    }

    prisma.users.update({
      where: { id: user.id },
      data: {
        full_name: 'کاربر سینماتیکت'
      },
    })
      .then((user) => {
        res.json({
          fullName: user.full_name,
          message: "نام کاربر با موفقیت تغییر کرد."
        });
      })
      .catch(next);
  }
];

module.exports = controller;
