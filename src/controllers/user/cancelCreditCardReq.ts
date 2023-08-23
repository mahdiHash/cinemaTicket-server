import { Request, Response } from "express";
import { middlewareWrapper } from "../../middlewares";
import { prisma, passport } from "../../config";
import { users } from "@prisma/client";
import { NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as cancelCreditCardReq };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  let creditCardReq = await prisma.credit_card_auth.deleteMany({
    where: { user_id: reqUserObj.id },
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('این کاربر درخواستی برای احراز هویت کارت بانکی ثبت نکرده است.');
  }

  res.json({
    message: 'درخواست احراز هویت کارت بانکی حذف شد.',
  });
}
