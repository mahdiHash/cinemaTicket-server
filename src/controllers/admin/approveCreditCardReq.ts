import { Request, Response } from 'express';
import { middlewareWrapper, creditCardAdminAuth } from '../../middlewares';
import { passport } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { AdminService, UserService } from '../../services';

const Admin = new AdminService();
const User = new UserService();

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(creditCardAdminAuth),

  middlewareWrapper(async (req: Request, res: Response) => {
    if (!Number.isFinite(+req.params.reqId)) {
      throw new BadRequestErr('شناسه درخواست نامعتبر است.');
    }

    let creditCardReq = await Admin.getCreditCardById(+req.params.reqId);

    if (creditCardReq === null) {
      throw new NotFoundErr('درخواست بررسی کارت بانکی پیدا نشد.');
    }

    // credit card request is found, so update the target user info
    await User.updateUserFinInfoById(creditCardReq.user_id, {
      credit_card_num: creditCardReq.credit_card_number,
      national_id: creditCardReq.national_id,
    });

    await Admin.deleteCreditCardById(creditCardReq.id);

    res.json({
      message: 'شماره کارت ثبت شد.',
    });
  }),
];

export { controller as approveCreditCardReq };
