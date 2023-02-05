const prisma = require('../../config/prismaConfig');
const inputValidator = require('../../utils/inputValidators/signupInputs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('../../utils/cipherFunc');

const controller = [
  // validate inputs
  (req, res, next) => {
    inputValidator.validateAsync(req.body)
      .then(() => next())
      .catch(next);
  },

  // signup user
  async (req, res, next) => {
    let hashedPass = await bcrypt.hash(req.body.password, 16);
    let user = await prisma.users.create({
      data: {
        tel: encrypt(req.body.tel),
        password: hashedPass,
      }
    })
      .catch(next);
    let token = jwt.sign(
      { id: user.id, tel: user.tel, exp: 1000 * 60 * 60 * 24 * 90 }, // 90 days
      process.env.JWT_TOKEN_SECRET
    );

    delete user.password;
    user.tel = decrypt(user.tel);
    res.json({
      token,
      user
    });
  }
];

module.exports = controller;
