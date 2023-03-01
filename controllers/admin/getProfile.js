const passport = require('../../config/passportConfig');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  (req, res, next) => {
    res.json({
      id: req.user.id,
      access_level: req.user.access_level,
      full_name: req.user.full_name,
      tel: decrypt(req.user.tel),
      email: decrypt(req.user.email),
      national_id: decrypt(req.user.national_id),
      home_tel: decrypt(req.user.home_tel),
      full_address: decrypt(req.user.full_address),
      profile_pic_url: req.user.profile_pic_url,
    })
  }
];

module.exports = controller;
