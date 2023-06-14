import { passport } from '../../config';
import { adminLoginInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { decrypt } from '../../helpers';
import { sign } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { admins } from '@prisma/client';

const controller = [
  middlewareWrapper(storeValidatedInputs(adminLoginInpValidator)),

  // authentication
  passport.authenticate('adminLocal', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as login };

async function middleware(req: Request, res: Response) {
  let reqAdminObj = req.user as admins;
  let token = sign(
    { id: reqAdminObj.id, tel: reqAdminObj.tel },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: '7d' }
  );

  res.clearCookie('userData', {
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie('authToken', token, {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie(
    'adminData', 
    JSON.stringify({
      id: reqAdminObj.id,
      access_level: reqAdminObj.access_level,
      full_name: reqAdminObj.full_name,
      tel: decrypt(reqAdminObj.tel),
      email: decrypt(reqAdminObj.email),
      national_id: decrypt(reqAdminObj.national_id),
      home_tel: decrypt(reqAdminObj.home_tel),
      full_address: decrypt(reqAdminObj.full_address),
      profile_pic_url: reqAdminObj.profile_pic_url,
    }), 
    {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      sameSite: 'lax',
      secure: process.env.ENV === 'production',
      domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
    }
  );

  res.json({
    message: 'با موفقیت وارد شدید. خوش آمدید.'
  });
}
