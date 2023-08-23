import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayService, PlayMediaService, PlayReviewService } from '../../services';

const PlayReview = new PlayReviewService();
const PlayMedia = new PlayMediaService();
const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
  
    await PlayMedia.removePlayPics(play.id);
    await PlayReview.removePlayReview(play.id);
    await Play.removePlay(play.id);
  
    res.json({
      message: 'نمایش حذف شد.',
    });
  }
  ),
];

export { controller as removePlay };
