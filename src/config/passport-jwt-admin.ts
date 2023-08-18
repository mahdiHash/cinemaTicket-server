import { Strategy, VerifiedCallback } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedErr } from "../helpers/errors/index.js";
import { encrypt, jwtExtractorFromCookie } from "../helpers";
import { prisma } from './prismaConfig.js';
import { envVariables } from "./envVariables.js";
import { decrypt } from "../helpers";

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: envVariables.jwtTokenSecret,
  },
  async (payload: JwtPayload, cb: VerifiedCallback) => {
    let admin = await prisma.admins.findFirst({
      where: {
        id: payload.id,
        tel: encrypt(payload.tel) as string,
      }
    });

    if (admin === null) {
      cb(new UnauthorizedErr());
    }
    else {
      // password field will be provided in JS
      admin.email = decrypt(admin.email) as string;
      admin.national_id = decrypt(admin.national_id) as string;
      admin.tel = decrypt(admin.tel) as string;
      admin.full_address = decrypt(admin.full_address) as string;
      admin.home_tel = decrypt(admin.home_tel) as string;    
      
      cb(null, admin);
    }
  }
);

export { jwtStrategy as adminJwtStrategy };
