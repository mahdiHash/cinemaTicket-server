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
      id: updatedUser.id,
      full_name: unescape(updatedUser.full_name),
      tel: decrypt(updatedUser.tel),
      email: decrypt(updatedUser.email),
      birthday: updatedUser.birthday,
      credit_card_num: decrypt(updatedUser.credit_card_num),
      national_id: decrypt(updatedUser.national_id),
      profile_pic_url: updatedUser.profile_pic_url,
    }

    res.json(descryptedUser);
  }
];

module.exports = controller;
