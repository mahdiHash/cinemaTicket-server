import { Request, Response } from 'express';
import { middlewareWrapper, creditCardAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { CreditCardService } from '../../services';

const CreditCard = new CreditCardService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(checkRouteParamType({ reqId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await CreditCard.removeCreditCardReq(+req.params.reqId);

    res.json({
      message: 'درخواست بررسی رد شد.',
    });
  }),
];

export { controller as denyCreditCardReq };
