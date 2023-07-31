import { Request, Response } from 'express';
import { middlewareWrapper } from '../../middlewares';
import { passport, envVariables } from '../../config';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(async (req: Request, res: Response) => {
    res.clearCookie('adminData', {
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });
  
    res.clearCookie('authToken', {
      httpOnly: true,
      signed: true,
      sameSite: 'lax',
      secure: envVariables.env === 'production',
      domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
    });
  
    res.json({
      message: 'با موفقیت خارج شدید.',
    });
  }
  ),
];

export { controller as logout };
