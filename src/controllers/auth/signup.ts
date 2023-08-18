import { Request, Response } from 'express';
import { envVariables } from '../../config';
import { signupInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { UserService } from '../../services';
import { users } from '@prisma/client';

const User = new UserService();
const controller = [
  middlewareWrapper(storeValidatedInputs(signupInpValidator)),

  // signup user
  middlewareWrapper(async function middleware(req: Request, res: Response) {
    const user = await User.signup(res.locals.validBody) as users;
    let token = await User.generateUserJWT(user);
    
    res.cookie('authToken', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });

    res.json({
      message: "ثبت نام با موفقیت انجام شد. خوش آمدید."
    });
  }
  )
];

export { controller as signup };
