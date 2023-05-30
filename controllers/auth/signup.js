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
      where: { tel: encrypt(res.locals.validBody.tel) },
    });

    if (duplicate) {
      res.status(400);
      return next(new BadRequestErr('قبلاً با این شماره همراه ثبت نام شده است.'));
    }
    else {
      next();
    }
  },

  // signup user
  async (req, res, next) => {
    let hashedPass = await bcrypt.hash(res.locals.validBody.password, 16);
    let hashedTel = encrypt(res.locals.validBody.tel);
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
    user.tel = res.locals.validBody.tel;

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    });

    res.cookie('userData', JSON.stringify(user), {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      sameSite: "lax",
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    });

    res.end();
  }
];

module.exports = controller;
