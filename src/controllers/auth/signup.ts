import { Request, Response } from 'express';
import { envVariables } from '../../config';
import { signupInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { UserService } from '../../services';

const User = new UserService();
const controller = [
  middlewareWrapper(storeValidatedInputs(signupInpValidator)),

  // signup user
  middlewareWrapper(async function middleware(req: Request, res: Response) {
    const user = await User.signup(res.locals.validBody);
    let token = await User.generateUserJWT(user);

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
  )
];

export { controller as signup };
