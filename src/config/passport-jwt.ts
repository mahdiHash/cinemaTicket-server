import { Strategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { jwtExtractorFromCookie } from '../helpers';
import { prisma, envVariables } from './';
import { encrypt } from '../helpers';
import { UserService } from '../services/index.js';

const User = new UserService();
const jwtStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: envVariables.jwtTokenSecret,
  },
  async (payload: JwtPayload, cb: VerifiedCallback) => {
    let user = await prisma.users.findFirst({
      where: {
        id: payload.id,
        tel: payload.tel,
      },
    });

    if (user === null) {
      cb(new UnauthorizedErr());
    }
    else {
      // password field will be provided in JS
      const decryptedUser = await User.decryptUserData(user);
      cb(null, decryptedUser);
    }
  }
);

export { jwtStrategy };
