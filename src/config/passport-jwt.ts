import { Strategy, VerifiedCallback } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedErr } from "../helpers/errors/index.js";
import { jwtExtractorFromCookie } from "../helpers";
import { prisma, envVariables } from "./";
import { encrypt } from "../helpers";

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
      }
    });

    if (user === null) {
      cb(new UnauthorizedErr());
    }
    else {
      cb(null, user);
    }
  }
);

export { jwtStrategy };
