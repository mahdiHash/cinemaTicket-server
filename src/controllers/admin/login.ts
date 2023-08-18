import { passport, envVariables } from '../../config';
import { adminLoginInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { Request, Response } from 'express';
import { admins } from '@prisma/client';
import { AdminService } from '../../services';

const Admin = new AdminService();
const controller = [
  middlewareWrapper(storeValidatedInputs(adminLoginInpValidator)),

  // authentication
  passport.authenticate('adminLocal', { session: false }),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;
    const token = await Admin.generateJWT(reqAdminObj);

    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });

    res.json({
      message: 'با موفقیت وارد شدید. خوش آمدید.',
    });
  }),
];

export { controller as login };
