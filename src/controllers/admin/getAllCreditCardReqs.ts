import { Request, Response } from "express";
import { middlewareWrapper, storeValidatedQuery } from "../../middlewares";
import { getAllCreditCardReqsQuValidator } from "../../validation/queryValidators";
import { prisma, passport } from "../../config";
import { decrypt } from "../../helpers";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(storeValidatedQuery(getAllCreditCardReqsQuValidator)),

  middlewareWrapper(middleware),
];

export { controller as getAllCreditCardReqs };

async function middleware(req: Request, res: Response) {
  let reqs = await prisma.credit_card_auth.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      credit_card_number: true,
      national_id: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
        }
      }
    },
    take: 15,
    cursor: req.query.cursor 
      ? { id: +res.locals.validQuery.cursor + 1 }
      : undefined,
  });

  for (let req of reqs) {
    req.credit_card_number = decrypt(req.credit_card_number) as string;
    req.national_id = decrypt(req.national_id) as string;
  }

  res.json(reqs);
}
