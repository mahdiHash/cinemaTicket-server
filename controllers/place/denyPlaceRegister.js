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
    if (!isFinite(req.params.id)) {
      return next(new BadRequestErr('پارامتر id باید یک عدد باشد.'));
    }

    let register = await prisma.non_approved_places.findUnique({
      where: { id: +req.params.id }
    })
      .catch(next);

    if (!register) {
      return next(new NotFoundErr('درخواستی پیدا نشد.'));
    }

    if (register.status === 'approved' || register.status === 'denied') {
      return next(new BadRequestErr('وضعیت ثبت این درخواست را نمی‌توان تغییر داد.'));
    }

    await prisma.non_approved_places.update({
      where: { id: register.id },
      data: { status: 'denied' },
    })
      .then(() => res.end())
      .catch(next);
  }
];

module.exports = controller;
