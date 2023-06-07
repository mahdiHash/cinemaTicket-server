import { Request } from "express";
import { Strategy, VerifiedCallback } from "passport-custom";
import { prisma } from "./index.js";
import { UnauthorizedErr } from "../helpers/errors/index.js";
import { encrypt } from "../helpers/index.js";
import { compare } from "bcryptjs";

const adminLocalStrategy = new Strategy(async (req: Request, cb: VerifiedCallback) => {
  let { tel, password } = req.body;
  let admin = await prisma.admins.findUnique({
    where: { tel: encrypt(tel) as string }
  });

  if (admin === null) {
    return cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }

  let doesPassMatch = await compare(password, admin.password);

  if (doesPassMatch) {
    cb(null, admin);
  }
  else {
    cb(new UnauthorizedErr('شماره همراه یا رمز ورود اشتباه است.'));
  }
});

export { adminLocalStrategy };
