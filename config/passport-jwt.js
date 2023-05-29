const { Strategy } = require('passport-jwt');
const jwtExtractorFromCookie = require('../utils/jwtExtractorFromCookie');
const prisma = require('./prismaConfig');
const UnauthorizedErr = require('../utils/errors/unauthorized');

const JWTStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: process.env.JWT_TOKEN_SECRET,
  },
  async (payload, cb) => {
    let user = await prisma.users.findFirst({
      where: {
        id: payload.id,
        tel: payload.tel,
      }
    });

    if (!user) {
      cb(new UnauthorizedErr());
    }
    else {
      cb(null, user);
    }
  }
);

module.exports = JWTStrategy;
