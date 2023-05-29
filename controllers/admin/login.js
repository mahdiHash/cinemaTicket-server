const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/adminLogin');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  storeValidatedInputs(inputValidator),
  
  // authentication
  passport.authenticate('adminLocal', { session: false }),

  // authentication successful
  (req, res, next) => {
    let token = jwt.sign(
      { id: req.user.id, tel: req.user.tel },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '7d'},
    );

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secret: process.env.ENV === 'production',
    });

    res.json({
      // decrypt some values for the client
      admin: {
        id: req.user.id,
        access_level: req.user.access_level,
        full_name: req.user.full_name,
        tel: decrypt(req.user.tel),
        email: decrypt(req.user.email),
        national_id: decrypt(req.user.national_id),
        home_tel: decrypt(req.user.home_tel),
        full_address: decrypt(req.user.full_address),
        profile_pic_url: req.user.profile_pic_url,
      }
    });
  }
];

module.exports = controller;
