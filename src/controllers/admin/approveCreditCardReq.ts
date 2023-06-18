import { Request, Response } from "express";
import { middlewareWrapper, creditCardAdminAuth } from "../../middlewares";
import { prisma, passport } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as approveCreditCardReq };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.reqId)) {
    throw new BadRequestErr('شناسه درخواست نامعتبر است.');
  }

  let creditCardReq = await prisma.credit_card_auth.findUnique({
    where: { id: +req.params.reqId }
  });

  if (creditCardReq === null) {
    throw new NotFoundErr('درخواست بررسی کارت بانکی پیدا نشد.');
  }

  // credit card request is found, so update the target user info
  await prisma.users.update({
    where: { id: creditCardReq.user_id },
    data: {
      credit_card_num: creditCardReq.credit_card_number,
      national_id: creditCardReq.national_id,
    }
  });

  await prisma.credit_card_auth.delete({
    where: { id: creditCardReq.id },
  });

  res.json({
    message: 'شماره کارت ثبت شد.',
  });
}
