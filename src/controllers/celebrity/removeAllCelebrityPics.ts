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

  middlewareWrapper(async (req: Request, res: Response) => {
    await Celeb.removeAllCelebPicsById(+req.params.id);

    res.json({
      message: 'تمام تصاویر هنرمند حذف شدند.',
    });
  }),
];

export { controller as removeAllCelebrityPics };
