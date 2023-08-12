import { Strategy, VerifiedCallback } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
import { UnauthorizedErr } from "../helpers/errors/index.js";
import { jwtExtractorFromCookie } from "../helpers";
import { prisma, envVariables } from "./";
import { AdminService } from "../services/index.js";

const Admin = new AdminService();
const jwtStrategy = new Strategy(
  {
    jwtFromRequest: jwtExtractorFromCookie,
    secretOrKey: envVariables.jwtTokenSecret,
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
      // password field will be provided in JS
      const decryptedAdmin = await Admin.decryptAdminData(admin);
      cb(null, decryptedAdmin);
    }
  }
);

export { jwtStrategy as adminJwtStrategy };
