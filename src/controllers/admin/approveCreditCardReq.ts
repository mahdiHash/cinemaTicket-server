import { Request, Response } from 'express';
import { middlewareWrapper, creditCardAdminAuth } from '../../middlewares';
import { passport } from '../../config';
import { CreditCardService, UserService } from '../../services';
import { encrypt } from '../../helpers';

const CreditCard = new CreditCardService();
const User = new UserService();

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    let creditCardReq = await CreditCard.getCreditCardReqById(+req.params.reqId);

    // credit card request is found, so update the target user info
    await User.updateUserById(creditCardReq.user_id as number, {
      credit_card_num: encrypt(creditCardReq.credit_card_number),
      national_id: encrypt(creditCardReq.national_id),
    });

    await CreditCard.removeCreditCardReqById(creditCardReq.id);

    res.json({
      message: 'شماره کارت ثبت شد.',
    });
  }),
];

export { controller as approveCreditCardReq };
