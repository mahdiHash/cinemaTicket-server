import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import { hash } from 'bcryptjs';
import { encrypt } from '../../helpers';
import { BadRequestErr } from '../../helpers/errors';
import { prisma, envVariables } from '../../config';
import { signupInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';

const controller = [
  middlewareWrapper(storeValidatedInputs(signupInpValidator)),

  // lookup for a duplicate phone number
  middlewareWrapper(checkForDuplicateTelMiddleware),

  // signup user
  middlewareWrapper(middleware)
];

export { controller as signup };

async function checkForDuplicateTelMiddleware(req: Request, res: Response) {
  let duplicate = await prisma.users.findFirst({
    where: { tel: encrypt(res.locals.validBody.tel) as string },
  });

  if (duplicate) {
    res.status(400);
    throw new BadRequestErr('قبلاً با این شماره همراه ثبت نام صورت گرفته است.');
  }
}

async function middleware(req: Request, res: Response) {
  let hashedPass = await hash(res.locals.validBody.password, 16);
  let hashedTel = encrypt(res.locals.validBody.tel);

  let user = await prisma.users.create({
    data: {
      tel: hashedTel as string,
      password: hashedPass
    }
  });
  let token = sign(
    { id: user.id, tel: hashedTel },
    envVariables.jwtTokenSecret,
    { expiresIn: '90d' }
  );
  let resUserObj = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    tel: res.locals.validBody.tel,
    email: user.email,
    birthday: user.birthday,
    credit_card_num: user.credit_card_num,
    national_id: user.national_id,
    profile_pic_url: user.profile_pic_url,
  };

  res.clearCookie('adminData', {
    sameSite: 'lax',
    secure: envVariables.env === 'production',
    domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie('authToken', token, {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: envVariables.env === 'production',
    domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
  });

  res.cookie('userData', JSON.stringify(resUserObj), {
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
    sameSite: 'lax',
    secure: envVariables.env === 'production',
    domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
  });

  res.json({
    message: "ثبت نام با موفقیت انجام شد. خوش آمدید."
  });
}
