const { Strategy } = require('passport-jwt');
const prisma = require('./prismaConfig');
const jwtExtractorFromCookie = require('../utils/jwtExtractorFromCookie');
const UnauthorizedErr = require('../utils/errors/unauthorized');

const JWTStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: process.env.JWT_TOKEN_SECRET,
  },
  async (payload, cb) => {
    let admin = await prisma.admins.findFirst({
      where: {
        id: payload.id,
        tel: payload.tel,
      }
    });

    if (!admin) {
      cb(new UnauthorizedErr());
    }
    else {
      cb(null, admin);
    }
  }
);

module.exports = JWTStrategy;
