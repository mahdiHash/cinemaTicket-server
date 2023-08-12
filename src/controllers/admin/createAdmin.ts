import { Request, Response } from 'express';
import { storeValidatedInputs, superAdminAuth, middlewareWrapper } from '../../middlewares';
import { hash } from 'bcryptjs';
import { encrypt } from '../../helpers';
import { passport } from '../../config';
import { AdminService } from '../../services';
import { createAdminInpValidator } from '../../validation/inputValidators';

const Admin = new AdminService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedInputs(createAdminInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    let admin = await Admin.createAdmin({
      access_level: res.locals.validBody.access_level,
      tel: encrypt(res.locals.validBody.tel) as string,
      full_name: res.locals.validBody.full_name,
      email: encrypt(res.locals.validBody.email) as string,
      national_id: encrypt(res.locals.validBody.national_id) as string,
      full_address: encrypt(res.locals.validBody.full_address) as string,
      home_tel: encrypt(res.locals.validBody.home_tel) as string,
      password: await hash(res.locals.validBody.password, 16),
    });

    res.json({
      admin,
      message: 'پروفایل ادمین ایجاد شد.',
    });
  }),
];

export { controller as createAdmin };
