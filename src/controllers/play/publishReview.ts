import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(middleware),
];

export { controller as publishReview };

async function middleware(req: Request, res: Response) {
  const review = await Play.getPlayReviewById(+req.params.playId);

  if (review.is_published) {
    return res.json({
      message: 'نقد پابلیش شد.',
    });
  }

  await Play.publishPlayReviewById(+req.params.playId);

  res.json({
    message: 'نقد پابلیش شد.',
  });
}
