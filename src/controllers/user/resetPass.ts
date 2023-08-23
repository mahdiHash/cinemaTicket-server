import { Request, Response } from "express";
import { passport } from "../../config";
import { resetPassInpValidator } from "../../validation/inputValidators";
import { storeValidatedInputs, middlewareWrapper } from "../../middlewares";
import { users } from "@prisma/client";
import { UserService } from "../../services";

const User = new UserService();
const controller = [
  // authorization
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(resetPassInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as resetPass };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  
  await User.resetPass(reqUserObj.id, {
    oldPass: reqUserObj.password,
    oldPassInput: res.locals.validBody.oldPass,
    newPass: res.locals.validBody.newPass,
  });

  res.json({
    message: "رمز عبور تغییر کرد."
  });
}
