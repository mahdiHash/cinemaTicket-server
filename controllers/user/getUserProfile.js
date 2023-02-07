const passport = require('../../config/passportConfig');
const { decrypt } = require('../../utils/cipherFunc');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  // authorization successful, send user's profile
  (req, res, next) => {
    req.user.tel = decrypt(req.user.tel);
    res.json(req.user);
  }
];

module.exports = controller;
