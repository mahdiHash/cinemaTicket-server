import { Request, Response } from 'express';
import { storeValidatedInputs, superAdminAuth, middlewareWrapper } from '../../middlewares';
import { hash } from 'bcryptjs';
import { encrypt } from '../../helpers';
import { prisma } from '../../config';
import { passport } from '../../config';
import { createAdminInpValidator } from '../../validation/inputValidators';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(superAdminAuth),

  middlewareWrapper(storeValidatedInputs(createAdminInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as createAdmin };

async function middleware(req: Request, res: Response) {
  let admin = await prisma.admins.create({
    data: {
      access_level: res.locals.validBody.access_level,
      tel: encrypt(res.locals.validBody.tel) as string,
      full_name: res.locals.validBody.full_name,
      email: encrypt(res.locals.validBody.email) as string,
      national_id: encrypt(res.locals.validBody.national_id) as string,
      full_address: encrypt(res.locals.validBody.full_address) as string,
      home_tel: encrypt(res.locals.validBody.home_tel) as string,
      password: await hash(res.locals.validBody.password, 16),
    },
  });

  delete res.locals.validBody.password;
  delete res.locals.validBody.repeatPass;
  res.locals.validBody.id = admin.id;
  res.locals.validBody.profile_pic_url = admin.profile_pic_url;

  res.json({
    admin: res.locals.validBody,
    message: 'پروفایل ادمین ایجاد شد.'
  });
}
