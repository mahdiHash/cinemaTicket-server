import { Request, Response } from 'express';
import { middlewareWrapper, storeValidatedInputs } from '../../middlewares';
import { encrypt } from '../../helpers';
import { prisma, passport } from '../../config';
import { creditCardInpValidator } from '../../validation/inputValidators';
import { users } from '@prisma/client';

const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(creditCardInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as submitCreditCard };

async function middleware(req: Request, res: Response) {
  const reqUserObj = req.user as users;

  await prisma.credit_card_auth.create({
    data: {
      credit_card_number: encrypt(res.locals.validBody.creditCard) as string,
      national_id: encrypt(res.locals.validBody.nationalId) as string,
      user_id: reqUserObj.id,
    }
  });

  res.json({
    message: 'درخواست برای بررسی ثبت شد.',
  });
}
