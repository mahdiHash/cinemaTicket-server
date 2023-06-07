import { Request, Response } from 'express';
import { middlewareWrapper } from '../../middlewares';
import { passport } from '../../config';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(middleware),
];

async function middleware(req: Request, res: Response) {
  res.clearCookie('adminData', {
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.clearCookie('authToken', {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: process.env.ENV === 'production',
    domain: process.env.ENV === 'dev' ? 'localhost' : 'example.com',
  });

  res.json({
    message: 'با موفقیت خارج شدید.',
  });
}

export { controller as logout };
