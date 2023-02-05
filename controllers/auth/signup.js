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
      .then(() => next())
      .catch(next);
  },

  // lookup for a duplicate phone number
  async (req, res, next) => {
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

  // signup user
  async (req, res, next) => {
    let hashedPass = await bcrypt.hash(req.body.password, 16);
    let hashedTel = encrypt(req.body.tel);
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
    user.tel = req.body.tel;
    res.json({
      token,
      user
    });
  }
];

module.exports = controller;
