const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const { decrypt } = require('../../utils/cipherFunc');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const NotFoundErr = require('../../utils/errors/notFoundErr');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    if (!isFinite(req.params.adminId)) {
      return next(new BadRequestErr('admin id not valid.'));
    }

    let admin = await prisma.admins.findUnique({
      where: { id: +req.params.adminId },
    })
      .catch(next);

    if (!admin) {
      return next(new NotFoundErr('admin not found.'));
    }

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
    })
  }
];

module.exports = controller;
