import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedInputs } from '../../middlewares';
import { passport } from '../../config';
import { creditCardInpValidator } from '../../validation/inputValidators';
import { users } from '@prisma/client';
import { CreditCardService } from '../../services';

const CreditCard = new CreditCardService();
const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(creditCardInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as submitCreditCard };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;

  await CreditCard.createCreditCardReq(reqUserObj.id, res.locals.validBody);

  res.json({
    message: 'درخواست برای بررسی ثبت شد.',
  });
}
