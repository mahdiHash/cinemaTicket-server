const prisma = require('../../config/prismaConfig');
const inputValidator = require('../../utils/inputValidators/signupInputs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { encrypt } = require('../../utils/cipherFunc');
const BadRequestErr = require('../../utils/errors/badRequestErr');

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

  // lookup for a duplicate phone number
  async (req, res, next) => {
    let duplicate = await prisma.users.findFirst({
      where: { tel: encrypt(res.locals.validatedBody.tel) },
    });

    if (duplicate) {
      res.status(400);
      return next(new BadRequestErr("There's already a user registered with this phone number."));
    }
    else {
      next();
    }
  },

  // signup user
  async (req, res, next) => {
    let hashedPass = await bcrypt.hash(res.locals.validatedBody.password, 16);
    let hashedTel = encrypt(res.locals.validatedBody.tel);
    let user = await prisma.users.create({
      data: {
        tel: hashedTel,
        password: hashedPass,
      }
    })
      .catch(next);
    let token = jwt.sign(
      { id: user.id, tel: hashedTel, exp: 1000 * 60 * 60 * 24 * 90 }, // 90 days
      process.env.JWT_TOKEN_SECRET
    );

    delete user.password;
    user.tel = res.locals.validatedBody.tel;
    res.json({
      token,
      user
    });
  }
];

module.exports = controller;
