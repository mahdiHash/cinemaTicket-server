const prisma = require('../../config/prismaConfig');
const inputValidator = require('../../utils/inputValidators/signupInputs');
const jwt = require('jsonwebtoken');
const escape = require('../../utils/escape');
const bcrypt = require('bcryptjs');

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
        tel: escape(req.body.tel),
        password: hashedPass,
      }
    })
    let token = jwt.sign(
      { id: user.id, tel: user.tel, exp: 1000 * 60 * 60 * 24 * 90 },
      process.env.JWT_TOKEN_SECRET
    );

    delete user.password;
    res.json({
      token,
      user
    });
  }
];

module.exports = controller;
