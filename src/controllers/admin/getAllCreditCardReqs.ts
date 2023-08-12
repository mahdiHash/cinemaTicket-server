import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedQuery, creditCardAdminAuth } from '../../middlewares';
import { getAllCreditCardReqsQuValidator } from '../../validation/queryValidators';
import { passport } from '../../config';
import { decrypt } from '../../helpers';
import { CreditCardService } from '../../services';

const CreditCard = new CreditCardService();

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllCreditCardReqsQuValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    let reqs = await CreditCard.getAllCreditCardReqs(res.locals.validQuery?.cursor);

    res.json(reqs);
  }),
];

export { controller as getAllCreditCardReqs };
