import { passport } from '../../config';
import { resetPassInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { AdminService } from '../../services';

const Admin = new AdminService();

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(storeValidatedInputs(resetPassInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;

    await Admin.resetPass(reqAdminObj.id, {
      oldPass: reqAdminObj.password,
      oldPassInput: res.locals.validBody.oldPass,
      newPass: res.locals.validBody.newPass,
    });

    res.json({
      message: 'رمز با موفقیت تغییر کرد.',
    });
  }),
];

export { controller as resetPass };
