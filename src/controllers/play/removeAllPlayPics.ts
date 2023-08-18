import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { prisma, passport, imageKit } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(middleware),
];

export { controller as removeAllPlayPics };

async function middleware(req: Request, res: Response) {
  await Play.removeAllPlayPicsById(+req.params.playId);

  res.json({
    message: 'تصاویر حذف شدند.',
  });
}
