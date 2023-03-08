const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/updateAdmin');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const ForbiddenErr = require('../../utils/errors/forbiddenErr');
const { encrypt, decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  // input validation
  (req, res, next) => {
    inputValidator
      .validateAsync(req.body)
      .then((body) => {
        // store validated body for further use (some values may be trimmed)
        res.locals.validBody = body;
        next();
      })
      .catch(next);
  },

  async (req, res, next) => {
    if (req.query.admin_id && !isFinite(req.query.admin_id)) {
      new BadRequestErr('admin id not valid.');
    }

    let targetAdmin = req.query.admin_id
      ? await prisma.admins.findUnique({
        where: { id: +req.query.admin_id },
      })
        .catch(next)
      : req.user;

    if (!targetAdmin) {
      return next(new NotFoundErr('admin not found.'));
    }

    if (
      (req.query.admin_id && req.user.access_level !== 'super') || // user is not super admin to modify others admins info
      (targetAdmin.id !== req.user.id && targetAdmin.access_level === 'super') // user is super admin and can't modify other super admins info
    ) {
      return next(new ForbiddenErr());
    }

    targetAdmin = {
      id: req.query.admin_id ? +req.query.admin_id : req.user.id,
      access_level: req.query.admin_id
        ? res.locals.validBody.access_level
        : req.user.access_level,
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
          id: admin.id,
          access_level: admin.access_level,
          full_name: admin.full_name,
          tel: decrypt(admin.tel),
          email: decrypt(admin.email),
          national_id: decrypt(admin.national_id),
          home_tel: decrypt(admin.home_tel),
          full_address: decrypt(admin.full_address),
          profile_pic_url: admin.profile_pic_url,
        });
      })
      .catch(next);
  },
];

module.exports = controller;
