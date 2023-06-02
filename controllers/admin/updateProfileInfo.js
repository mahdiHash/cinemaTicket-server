const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/updateAdmin');
const jwt = require('jsonwebtoken');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const { encrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeValidatedInputs(inputValidator),
  
  async (req, res, next) => {
    let upAdmin = {
      id: req.user.id,
      access_level: req.user.access_level,
      full_name: res.locals.validBody.full_name,
      tel: encrypt(res.locals.validBody.tel),
      email: encrypt(res.locals.validBody.email),
      national_id: encrypt(res.locals.validBody.national_id),
      home_tel: encrypt(res.locals.validBody.home_tel),
      full_address: encrypt(res.locals.validBody.full_address),
    };

    prisma.admins.update({
      where: { id: upAdmin.id },
      data: upAdmin,
    })
      .then((admin) => {
        let token = jwt.sign(
          { id: admin.id, tel: admin.tel}, 
          process.env.JWT_TOKEN_SECRET
        );

        res.cookie('authToken', token, {
          maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
          httpOnly: true,
          signed: true,
          sameSite: 'lax',
          secret: process.env.ENV === 'production',
          domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
        });

        res.cookie(
          'adminData', 
          {
            id: admin.id,
            access_level: admin.access_level,
            full_name: admin.full_name,
            tel: decrypt(admin.tel),
            email: decrypt(admin.email),
            national_id: decrypt(admin.national_id),
            home_tel: decrypt(admin.home_tel),
            full_address: decrypt(admin.full_address),
            profile_pic_url: admin.profile_pic_url,
          }, 
          {
            maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
            sameSite: 'lax',
            secret: process.env.ENV === 'production',
            domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
          }
        );

        res.end();
      })
      .catch(next);
  },
];

module.exports = controller;
