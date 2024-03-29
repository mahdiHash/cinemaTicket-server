import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayService } from '../../services';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
  
    const review = await PlayReview.getPlayReview(+play.id, { hideWriterId: false });
  
    res.json(review);
  }
  ),
];

export { controller as getReviewForAdmins };
