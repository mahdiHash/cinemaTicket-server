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

    req.user.tel = decrypt(req.user.tel);
    res.json({
      token,
      user: req.user,
    })
  }
];

module.exports = controller;
