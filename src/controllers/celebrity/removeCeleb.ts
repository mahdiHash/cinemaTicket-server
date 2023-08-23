import { Request, Response } from 'express';
import { passport } from '../../config';
import { playAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityService } from '../../services';

const Celeb = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(middleware),
];

export { controller as removeCeleb };

async function middleware(req: Request, res: Response) {
  await Celeb.removeCeleb(+req.params.id);

  res.json({
    message: 'پروفایل هنرمند حذف شد.',
  });
}
