const passport = require('passport');
const inputValidator = require('../../utils/inputValidators/loginInputs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  // validate inputs
  (req, res, next) => {
    inputValidator.validateAsync(req.body)
      .then((body) => {
        // store validated body for further use (some values may be trimmed)
        res.locals.validatedBody = body;
        next();
      })
      .catch(next);
  },

  // authenticate user
  passport.authenticate('local', { session: false }),

  // authentication successful
  (req, res, next) => {
    let token = jwt.sign(
      { id: req.user.id, tel: req.user.tel, exp: 1000 * 60 * 60 * 24 * 90 }, // 90 days
      process.env.JWT_TOKEN_SECRET,
    );

    // decrypt some vlaues for the client
    let descryptedUser = {
      id: req.user.id,
      full_name: req.user.full_name,
      tel: decrypt(req.user.tel),
      email: decrypt(req.user.email),
      birthday: req.user.birthday,
      credit_card_num: decrypt(req.user.credit_card_num),
      national_id: decrypt(req.user.national_id),
      profile_pic_url: req.user.profile_pic_url,
    }

    res.json({
      token,
      user: descryptedUser,
    });
  }
];

module.exports = controller;
