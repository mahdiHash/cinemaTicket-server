const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/resetPassAdmin');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const bcrypt = require('bcryptjs');
const UnauthorizedErr = require('../../utils/errors/unauthorized');

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  storeValidatedInputs(inputValidator),
  
  async (req, res, next) => {
    let doesPassMatch = await bcrypt.compare(req.body.oldPass, req.user.password);

    if (!doesPassMatch) {
      return next(new UnauthorizedErr('رمز ورود قدیمی اشتباه است.'));
    }

    let newPassHash = await bcrypt.hash(res.locals.validBody.newPass, 16);

    prisma.admins.update({
      where: { id: req.user.id },
      data: { password: newPassHash },
    })
      .then(() => {
        res.json({
          message: "رمز با موفقیت تغییر کرد."
        })
      })
      .catch(next);
  }
];

module.exports = controller;
