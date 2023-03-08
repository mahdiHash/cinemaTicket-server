const prisma = require('../../config/prismaConfig');
const inputValidator = require('../../utils/inputValidators/signupInputs');
const storeValidatedInputs = require('../../utils/middleware/storeValidatedInputs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { encrypt } = require('../../utils/cipherFunc');
const BadRequestErr = require('../../utils/errors/badRequestErr');

const controller = [
  storeValidatedInputs(inputValidator),
  
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
      { id: user.id, tel: hashedTel },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: '90d' },
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
