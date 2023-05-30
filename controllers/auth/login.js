const passport = require('passport');
const inputValidator = require('../../utils/inputValidators/loginInputs');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../utils/cipherFunc');
const { unescape } = require('../../utils/sanitizeInputs');

const controller = [
  storeValidatedInputs(inputValidator),
  
  // authenticate user
  passport.authenticate('local', { session: false }),

  // authentication successful
  (req, res, next) => {
    let token = jwt.sign(
      { id: req.user.id, tel: req.user.tel },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '90d' },
    );

    // decrypt some vlaues for the client
    let decryptedUser = {
      id: req.user.id,
      full_name: unescape(req.user.full_name),
      tel: decrypt(req.user.tel),
      email: decrypt(req.user.email),
      birthday: req.user.birthday,
      credit_card_num: decrypt(req.user.credit_card_num),
      national_id: decrypt(req.user.national_id),
      profile_pic_url: req.user.profile_pic_url,
    }

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    });

    res.cookie('userData', JSON.stringify(decryptedUser), {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    })

    res.end();
  }
];

module.exports = controller;
