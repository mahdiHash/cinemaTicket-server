const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const placeRegisterOwnerAuth = require('../../utils/middleware/placeRegisterOwnerAuth');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  placeRegisterOwnerAuth,

  (req, res ,next) => {
    prisma.non_approved_places.delete({
      where: { code: req.params.code },
    })
      .then(() => {
        res.json({
          message: "درخواست ثبت مکان لغو شد."
        });
      })
      .catch(next);
  }
];

module.exports = controller;
