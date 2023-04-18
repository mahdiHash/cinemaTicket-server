const { Strategy } = require('passport-custom');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaConfig');
const UnauthorizedErr = require('../utils/errors/unauthorized');

const adminJwtStrategy = new Strategy(async (req, cb) => {
  let token = req.headers.authorization?.split(' ')[1];
  let payload;
  
  try {
    payload = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  }
  catch (err) {
    return cb(new UnauthorizedErr('توکن هویت‌سنجی معتبر نیست.'));
  }

  let admin = await prisma.admins.findFirst({
    where: { id: payload.id, tel: payload.tel },
  })
    .catch(cb);

  if (!admin) {
    cb(new UnauthorizedErr('توکن هویت‌سنجی معتبر نیست.'));
  }
  else {
    cb(null, admin);
  }
});

module.exports = adminJwtStrategy;
