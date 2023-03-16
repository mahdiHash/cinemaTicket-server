const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  async (req, res, next) => {
    let registers = await prisma.non_approved_places.findMany({
      include: {
        owner: {
          select: {
            id: true,
            full_name: true,
            tel: true,
            email: true,
            national_id: true,
            profile_pic_url: true,
          }
        }
      }
    })
      .catch(next);

    // decrypt encoded values
    for (let reg of registers) {
      reg.owner.email = decrypt(reg.owner.email);
      reg.owner.national_id = decrypt(reg.owner.national_id);
      reg.owner.tel = decrypt(reg.owner.tel);
    }

    res.json(registers);
  }
];

module.exports = controller;
