import { Request, Response } from "express";
import { passport, prisma } from "../../config";
import { resetPassInpValidator } from "../../validation/inputValidators";
import { storeValidatedInputs, middlewareWrapper } from "../../middlewares";
import { hash, compare } from "bcryptjs";
import { UnauthorizedErr } from "../../helpers/errors";
import { users } from "@prisma/client";

const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(resetPassInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as resetPass };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  let isMatch = await compare(
    res.locals.validBody.oldPass,
    reqUserObj.password
  );

  if (!isMatch) {
    throw new UnauthorizedErr('رمز ورود قدیمی اشتباه است.');
  }

  let newHashedPass = await hash(res.locals.validBody.newPass, 16);

  await prisma.users.update({
    where: { id: reqUserObj.id },
    data: {
      password: newHashedPass,
    },
  });

  res.json({
    message: "رمز عبور تغییر کرد."
  });
}