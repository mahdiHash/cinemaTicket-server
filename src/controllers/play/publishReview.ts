import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const review = await PlayReview.getPlayReview(+req.params.playId);
  
    if (review.is_published) {
      return res.json({
        message: 'نقد پابلیش شد.',
      });
    }
  
    await PlayReview.publishPlayReview(+req.params.playId);
  
    res.json({
      message: 'نقد پابلیش شد.',
    });
  }
  ),
];

export { controller as publishReview };
