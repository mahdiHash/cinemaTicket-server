import { Request, Response } from 'express';
import { middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(middleware),
];

export { controller as getReview };

async function middleware(req: Request, res: Response) {
  const play = await Play.getPlayById(+req.params.playId);
  const review = await Play.getPlayReviewById(play.id, { isPublic : true });

  res.json(review);
}
