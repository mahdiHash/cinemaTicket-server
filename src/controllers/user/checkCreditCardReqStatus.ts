import { Request, Response } from "express";
import { middlewareWrapper } from "../../middlewares";
import { passport, prisma } from "../../config";
import { users } from "@prisma/client";
import { decrypt } from "../../helpers";

const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as checkCreditCardReqStatus };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;
  let creditCardReq = await prisma.credit_card_auth.findFirst({
    where: { user_id: reqUserObj.id },
    select: {
      credit_card_number: true,
      national_id: true,
    }
  });

  if (creditCardReq === null) {
    res.json(null);
    return;
  }

  res.json({
    creditCardNum: decrypt(creditCardReq.credit_card_number),
    nationalId: decrypt(creditCardReq.national_id),
  });
}
