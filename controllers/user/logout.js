const passport = require('../../config/passportConfig');

const controller = [
  passport.authenticate('jwt', { session: false }),

  (req, res, next) => {
    res.clearCookie('userData', {
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    });

    res.clearCookie('authToken', {
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    });

    res.end();
  }
];

module.exports = controller;
