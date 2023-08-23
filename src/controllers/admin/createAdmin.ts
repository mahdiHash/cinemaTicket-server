import { Request, Response } from 'express';
import { storeValidatedInputs, superAdminAuth, middlewareWrapper } from '../../middlewares';
import { hash } from 'bcryptjs';
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
      tel: res.locals.validBody.tel,
      full_name: res.locals.validBody.full_name,
      email: res.locals.validBody.email,
      national_id: res.locals.validBody.national_id,
      full_address: res.locals.validBody.full_address,
      home_tel: res.locals.validBody.home_tel,
      password: await hash(res.locals.validBody.password, 16),
    });

    res.json({
      admin,
      message: 'پروفایل ادمین ایجاد شد.',
    });
  }),
];

export { controller as createAdmin };
