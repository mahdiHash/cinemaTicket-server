import { Request, Response } from "express";
import { middlewareWrapper, creditCardAdminAuth } from "../../middlewares";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { prisma, passport } from "../../config";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as denyCreditCardReq };

async function middleware(req:Request, res: Response) {
  if (!Number.isFinite(+req.params.reqId)) {
    throw new BadRequestErr('شناسه درخواست معتبر نیست.');
  }

  let creditCardReq = await prisma.credit_card_auth.delete({
    where: { id: +req.params.reqId }
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('درخواست بررسی کارت بانکی پیدا نشد.');
  }

  res.json({
    message: 'درخواست بررسی رد شد.',
  });
}
