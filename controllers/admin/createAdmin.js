const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/createAdmin');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const superAdminAuth = require('../../utils/middleware/superAdminAuth');
const bcrypt = require('bcryptjs');
const { encrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  superAdminAuth,

  storeValidatedInputs(inputValidator),
  
  async (req, res, next) => {
    prisma.admins.create({
      data: {
        access_level: res.locals.validBody.access_level,
        tel: encrypt(res.locals.validBody.tel),
        full_name: res.locals.validBody.full_name,
        email: encrypt(res.locals.validBody.email),
        national_id: encrypt(res.locals.validBody.national_id),
        full_address: encrypt(res.locals.validBody.full_address),
        home_tel: encrypt(res.locals.validBody.home_tel),
        password: await bcrypt.hash(res.locals.validBody.password, 16),
      }
    })
      .then((admin) => {
        delete res.locals.validBody.password;
        delete res.locals.validBody.repeatPass;
        res.locals.validBody.id = admin.id;
        res.locals.validBody.profile_pic_url = admin.profile_pic_url;

        res.json(res.locals.validBody);
      })
      .catch(next);
  }
];

module.exports = controller;

