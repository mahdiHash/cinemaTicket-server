import { Request, Response } from 'express';
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport } from '../../config';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Play.removePlayPicByUrl(`/${req.params.folder}/${req.params.fileId}`);
  
    res.json({
      message: 'تصویر حذف شد.',
    });
  }
  ),
];

export { controller as removeReviewPic };
