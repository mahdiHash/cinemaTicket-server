import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { PlayService } from '../../services';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const Play = new PlayService();
const controller = [
  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
    const review = await PlayReview.getPlayReview(play.id, { isPublic : true });
  
    res.json(review);
  }
  ),
];

export { controller as getReview };
