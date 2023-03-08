const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/updateAdmin');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');
const { encrypt } = require('../../utils/cipherFunc');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

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
    if (!isFinite(req.params.adminId)) {
      new BadRequestErr('admin id not valid.');
    }

    let targetAdmin = await prisma.admins.findUnique({
        where: { id: +req.params.adminId },
      })
        .catch(next);

    if (!targetAdmin) {
      return next(new NotFoundErr('admin not found.'));
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
          id: req.params.adminId,
          access_level: res.locals.validBody.access_level,
          full_name: res.locals.validBody.full_name,
          tel: res.locals.validBody.tel,
          email: res.locals.validBody.email,
          national_id: res.locals.validBody.national_id,
          home_tel: res.locals.validBody.home_tel,
          full_address: res.locals.validBody.full_address,
          profile_pic_url: admin.profile_pic_url,
        });
      })
      .catch(next);
  },
];

module.exports = controller;
