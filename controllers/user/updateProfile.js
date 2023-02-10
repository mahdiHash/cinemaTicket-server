const prisma = require('../../config/prismaConfig');
const passport = require('../../config/passportConfig');
const inputsValidator = require('../../utils/inputValidators/updateUserProfileInputs');
const { encrypt, decrypt } = require('../../utils/cipherFunc');
const jwt = require('jsonwebtoken');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  // validate inputs
  (req, res, next) => {
    inputsValidator.validateAsync(req.body)
      .then(() => next())
      .catch(next);
  },

  // if req.body.tel is provided and is not the same as before, 
  // look up for a duplicate phone number
  async (req, res, next) => {
    if (!req.body.tel || encrypt(req.body.tel) === req.user.tel) {
      return next();
    }

    let duplicate = await prisma.users.findFirst({
      where: { tel: encrypt(req.body.tel) },
    });

    if (duplicate) {
      res.status(400);
      return next(new BadRequestErr("There's already a user registered with this phone number."));
    }
    else {
      next();
    }
  },

  // authorization successful, update user's profile info
  (req, res, next) => {
    // encrypt tel to store in db
    if (req.body.tel) {
      res.locals.tel = encrypt(req.body.tel);
    }

    // regulate birthday for prismaClient
    if (req.body.birthday) {
      res.locals.birthday = new Date(req.body.birthday);
    }

    // tel and birthday properties values should change if they exist. 
    // I stored them in res.locals above and now I'm seperating the rest 
    // of properties to be unchanged.
    let { tel, birthday, ...restBody } = req.body;

    // if you pass undefined to a field while updateing a record, prisma won't
    // update that field, so if tel and birthday aren't provided, they won't 
    // exist in res.locals and won't be updated.
    prisma.users.update({
      where: { id: req.user.id },
      data: {
        tel: res.locals.tel,
        birthday: res.locals.birthday,
        ...restBody,
      },
    })
      .then((updatedUser) => {
        let token = jwt.sign(
          {
            id: updatedUser.id,
            tel: updatedUser.tel,
            exp: 1000 * 60 * 60 * 24 * 90, // 90 days
          },
          process.env.JWT_TOKEN_SECRET
        );

        updatedUser.tel = decrypt(updatedUser.tel);
        res.json({
          token,
          user: updatedUser,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
];

module.exports = controller;
