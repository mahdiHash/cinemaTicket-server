import { Strategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedErr } from '../helpers/errors/index.js';
import { encrypt, jwtExtractorFromCookie } from '../helpers';
import { prisma } from './prismaConfig.js';
import { envVariables } from "./envVariables.js";
import { decrypt } from '../helpers';

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: envVariables.jwtTokenSecret,
  },
  async (payload: JwtPayload, cb: VerifiedCallback) => {
    let user = await prisma.users.findFirst({
      where: {
        id: payload.id,
        tel: encrypt(payload.tel) as string,
      },
    });

    if (user === null) {
      cb(new UnauthorizedErr());
    }
    else {
      // password field will be provided in JS
      user.email = decrypt(user.email);
      user.national_id = decrypt(user.national_id);
      user.credit_card_num = decrypt(user.credit_card_num);
      user.tel = decrypt(user.tel) as string;

      cb(null, user);
    }
  }
);

export { jwtStrategy };
