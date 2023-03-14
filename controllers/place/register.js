const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputValidator = require('../../utils/inputValidators/placeRegister');
const { randomBytes } = require('crypto');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const contoller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  storeValidatedInputs(inputValidator),

  async (req, res, next) => {
    let code;

    // generate a unique code
    while (true) {
      code = randomBytes(8).toString('hex');
      let duplicate = await prisma.non_approved_places.findUnique({
        where: { code }
      })
        .catch(next);

      if (!duplicate) {
        break;
      }
    }

    // look up a duplicate license_id
    prisma.non_approved_places.findFirst({
      where: {
        license_id: res.locals.validBody.license_id,
        OR: [
          { status: 'waiting' },
          { status: 'approved' },
        ],
      }
    })
      .then((place) => {
        if (place) {
          throw new BadRequestErr('a place already exists with this license_id.');
        }
      })
      .then(() => {
        prisma.non_approved_places.create({
          data: {
            owner_id: req.user.id,
            status: 'waiting',
            code,
            ...res.locals.validBody,
          }
        })
          .then(() => res.json(code));
      })
      .catch(next);
  }
];

module.exports = contoller;
