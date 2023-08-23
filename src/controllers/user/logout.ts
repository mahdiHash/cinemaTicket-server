import { passport, envVariables } from "../../config";
import { Request, Response, NextFunction } from "express";
import { middlewareWrapper } from "../../middlewares";

const controller = [
  passport.authenticate('jwt', { session: false }),

  middlewareWrapper(middleware),
];

export { controller as logout };

async function middleware(req: Request, res: Response) {
  res.clearCookie('authToken', {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    secure: envVariables.env === 'production',
    domain: envVariables.env === 'dev' ? 'localhost' : 'example.com',
  });

  res.json({
    message: "با موفقیت خارج شدید."
  });
}
