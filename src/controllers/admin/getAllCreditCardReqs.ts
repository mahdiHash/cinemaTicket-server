import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedQuery, creditCardAdminAuth } from '../../middlewares';
import { getAllCreditCardReqsQuValidator } from '../../validation/queryValidators';
import { passport } from '../../config';
import { decrypt } from '../../helpers';
import { AdminService } from '../../services';

const Admin = new AdminService();

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(storeValidatedQuery(getAllCreditCardReqsQuValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    let reqs = await Admin.getAllCreditCardReqs(res.locals.validQuery?.cursor);

    for (let req of reqs) {
      req.credit_card_number = decrypt(req.credit_card_number) as string;
      req.national_id = decrypt(req.national_id) as string;
    }

    res.json(reqs);
  }),
];

export { controller as getAllCreditCardReqs };
