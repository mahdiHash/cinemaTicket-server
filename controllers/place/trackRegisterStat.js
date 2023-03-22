const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const placeRegisterOwnerAuth = require('../../utils/middleware/placeRegisterOwnerAuth');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  placeRegisterOwnerAuth,

  (req, res, next) => {
    prisma.non_approved_places.findUnique({
      where: { code: req.params.code },
    })
      .then((place) => {
        res.json({
          name: place.name,
          type: place.type,
          license_id: place.license_id,
          address: place.address,
          city: place.city,
          status: place.status,
        });
      })
      .catch(next);
  }
];

module.exports = controller;
