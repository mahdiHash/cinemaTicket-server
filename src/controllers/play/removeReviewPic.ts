import { Request, Response } from 'express';
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayMediaService } from '../../services/play.media.service';

const PlayMedia = new PlayMediaService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await PlayMedia.removePlayPic(`/${req.params.folder}/${req.params.fileName}`);
  
    res.json({
      message: 'تصویر حذف شد.',
    });
  }
  ),
];

export { controller as removeReviewPic };
