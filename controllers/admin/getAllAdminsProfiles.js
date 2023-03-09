const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const { decrypt } = require('../../utils/cipherFunc');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    let admins = await prisma.admins.findMany({
      where: { id: { not: req.user.id }},
      orderBy: [ { access_level: 'asc'}, { full_name: 'asc' } ],
    });

    for (let admin of admins) {
      admin.tel = decrypt(admin.tel);
      admin.email = decrypt(admin.email);
      admin.home_tel = decrypt(admin.home_tel);
      admin.national_id = decrypt(admin.national_id);
      admin.full_address = decrypt(admin.full_address);
      delete admin.password;
      delete admin.profile_pic_fileId;
    }

    res.json(admins);
  }
];

module.exports = controller;
