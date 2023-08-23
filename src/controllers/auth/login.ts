import { Request, Response, RequestHandler } from 'express';
import { users } from '@prisma/client';
import { loginInpValidator } from '../../validation/inputValidators';
import { storeValidatedInputs, middlewareWrapper } from '../../middlewares';
import { passport, envVariables } from '../../config';
import { UserService } from '../../services';

const User = new UserService();
const controller: RequestHandler[] = [
  middlewareWrapper(storeValidatedInputs(loginInpValidator)),

  // authenticate user
  passport.authenticate('local', { session: false }),

  // authentication successful
  middlewareWrapper(async (req: Request, res: Response) => {
    // this is done to avoid this error: https://stackoverflow.com/questions/76296575/user-object-req-user-structure-doesnt-match-the-database-model-schema-after-a
    let userObj = req.user as users;
    let token = await User.generateUserJWT(userObj);

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
  }
  ),
];

export { controller as login };
