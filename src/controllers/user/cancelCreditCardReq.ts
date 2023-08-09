import { Request, Response } from "express";
import { middlewareWrapper } from "../../middlewares";
import { passport } from "../../config";
import { users } from "@prisma/client";
import { UserService } from "../../services";

const User = new UserService();
const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as cancelCreditCardReq };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;

  await User.cancelCreditCardReq(reqUserObj.id);

  res.json({
    message: 'درخواست احراز هویت کارت بانکی حذف شد.',
  });
}
