const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/resetPassAdmin');
const bcrypt = require('bcryptjs');
const UnauthorizedErr = require('../../utils/errors/unauthorized');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  // input validation
  (req, res, next) => {
    inputValidator.validateAsync(req.body)
      .then((body) => {
        // store validated body values for further use (some values may be trimmed)
        res.locals.validBody = body;
        next();
      })
      .catch(next);
  },

  async (req, res, next) => {
    let doesPassMatch = await bcrypt.compare(req.body.oldPass, req.user.password);

    if (!doesPassMatch) {
      return next(new UnauthorizedErr('old password is incorrect.'));
    }

    let newPassHash = await bcrypt.hash(res.locals.validBody.newPass, 16);

    prisma.admins.update({
      where: { id: req.user.id },
      data: { password: newPassHash },
    })
      .then(() => {
        res.end();
      })
      .catch(next);
  }
];

module.exports = controller;
