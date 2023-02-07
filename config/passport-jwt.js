const { Strategy, ExtractJwt } = require('passport-jwt');
const prisma = require('./prismaConfig');
const UnauthorizedErr = require('../utils/errors/unauthorized');

const JWTStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      delete user.password;
      cb(null, user);
    }
  }
);

module.exports = JWTStrategy;
