import { Strategy, VerifiedCallback } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedErr } from "../helpers/errors/index.js";
import { jwtExtractorFromCookie } from "../helpers";
import { prisma } from "./index.js";

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: process.env.JWT_TOKEN_SECRET,
  },
  async (payload: JwtPayload, cb: VerifiedCallback) => {
    let admin = await prisma.admins.findFirst({
      where: {
        id: payload.id,
        tel: payload.tel,
      }
    });

    if (admin === null) {
      cb(new UnauthorizedErr());
    }
    else {
      cb(null, admin);
    }
  }
);

export { jwtStrategy as adminJwtStrategy };
