const { Strategy } = require('passport-custom');
const prisma = require('./prismaConfig');
const UnauthorizedErr = require('../utils/errors/unauthorized');
const { encrypt } = require('../utils/cipherFunc');
const bcrypt = require('bcryptjs');

const adminLocalStrategy = new Strategy(async (req, cb) => {
  let { tel, password } = req.body;
  let admin = await prisma.admins.findUnique({
    where: { tel: encrypt(tel) }
  });

  if (!admin) {
    return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }

  let doesPassMatch = await bcrypt.compare(password, admin.password);

  if (doesPassMatch) {
    cb(null, admin);
  }
  else {
    cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }
});

module.exports = adminLocalStrategy;
