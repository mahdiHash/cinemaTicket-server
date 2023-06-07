import { Request, Response, NextFunction, RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';
import { decrypt, unescape } from '../../helpers';
import { users } from '@prisma/client';
import { loginInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { passport } from '../../config';

const controller: RequestHandler[] = [
  middlewareWrapper(storeValidatedInputs(loginInpValidator)),

  // authenticate user
  passport.authenticate('local', { session: false }),

  // authentication successful
  middlewareWrapper(middleware),
];

export { controller as login };

async function middleware(req: Request, res: Response) {
  // this is done to avoid this error: https://stackoverflow.com/questions/76296575/user-object-req-user-structure-doesnt-match-the-database-model-schema-after-a
  let userObj = req.user as users;
  let token = sign(
    { id: userObj.id, tel: userObj.tel },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: '90d' }
  );

  // decrypt some vlaues for the client
  let decryptedUser = {
    id: userObj.id,
    full_name: unescape(userObj.full_name),
    tel: decrypt(userObj.tel),
    email: decrypt(userObj.email),
    birthday: userObj.birthday,
    credit_card_num: decrypt(userObj.credit_card_num),
    national_id: decrypt(userObj.national_id),
    profile_pic_url: userObj.profile_pic_url,
  };

  res.clearCookie('adminData', {
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

  res.cookie('userData', JSON.stringify(decryptedUser), {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.json({
    message: 'با موفقیت وارد شدید. خوش آمدید.',
  });
}
