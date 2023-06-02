const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/updateAdmin');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const { encrypt } = require('../../utils/cipherFunc');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const ForbiddenErr = require('../../utils/errors/forbiddenErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  storeValidatedInputs(inputValidator),

  async (req, res, next) => {
    if (!isFinite(req.params.adminId)) {
      new BadRequestErr('شناسۀ ادمین باید یک عدد باشد.');
    }

    let targetAdmin = await prisma.admins.findUnique({
        where: { id: +req.params.adminId },
      })
        .catch(next);

    if (!targetAdmin) {
      return next(new NotFoundErr('ادمین پیدا نشد.'));
    }

    if (targetAdmin.access_level === 'super') {
      return next(new ForbiddenErr('ادمین برتر نمی‌تواند پروفایل دیگر ادمین‌های برتر را آپدیت کند.'));
    }

    targetAdmin = {
      id: +req.params.adminId,
      access_level: res.locals.validBody.access_level,
      full_name: res.locals.validBody.full_name,
      tel: encrypt(res.locals.validBody.tel),
      email: encrypt(res.locals.validBody.email),
      national_id: encrypt(res.locals.validBody.national_id),
      home_tel: encrypt(res.locals.validBody.home_tel),
      full_address: encrypt(res.locals.validBody.full_address),
    };

    prisma.admins.update({
      where: { id: targetAdmin.id },
      data: targetAdmin,
    })
      .then((admin) => {
        res.json({
          admin: {
            id: req.params.adminId,
            access_level: res.locals.validBody.access_level,
            full_name: res.locals.validBody.full_name,
            tel: res.locals.validBody.tel,
            email: res.locals.validBody.email,
            national_id: res.locals.validBody.national_id,
            home_tel: res.locals.validBody.home_tel,
            full_address: res.locals.validBody.full_address,
            profile_pic_url: admin.profile_pic_url,
          },
          message: "اطلاعات ادمین با موفقیت تغییر کرد."
        });
      })
      .catch(next);
  },
];

module.exports = controller;
