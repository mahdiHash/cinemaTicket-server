const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const prisma = require('./prismaConfig');
const { encrypt } = require('../utils/cipherFunc');
const UnauthorizedErr = require('../utils/errors/unauthorized');

let strategy = new LocalStrategy(
  { usernameField: "tel" },
  async (tel, pass, cb) => {
    let encryptedTel = encrypt(tel);
    let user = await prisma.users.findUnique({
      where: {
        tel: encryptedTel,
      }
    });

    if (!user) {
      return cb(new UnauthorizedErr('tel or password field is incorrect.'));
    }

    let isPassMatch = await bcrypt.compare(pass, user.password);

    if (isPassMatch) {
      cb(null, user);
    }
    else {
      cb(new UnauthorizedErr('tel or password field is incorrect.'));
    }
  }
);

module.exports = strategy;
