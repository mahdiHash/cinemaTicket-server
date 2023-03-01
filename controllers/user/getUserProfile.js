const passport = require('../../config/passportConfig');
const { decrypt } = require('../../utils/cipherFunc');
const { unescape } = require('../../utils/sanitizeInputs');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  // authorization successful, send user's profile
  (req, res, next) => {
    // decrypt some vlaues for the client
    let descryptedUser = {
      id: req.user.id,
      full_name: unescape(req.user.full_name),
      tel: decrypt(req.user.tel),
      email: decrypt(req.user.email),
      birthday: req.user.birthday,
      credit_card_num: decrypt(req.user.credit_card_num),
      national_id: decrypt(req.user.national_id),
      profile_pic_url: req.user.profile_pic_url,
    }

    res.json(descryptedUser);
  }
];

module.exports = controller;
