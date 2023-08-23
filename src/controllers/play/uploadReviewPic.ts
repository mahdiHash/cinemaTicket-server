import { Request, Response } from 'express';
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport, storeImgLocally } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { PlayService } from '../../services';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  storeImgLocally.single('img'),

  middlewareWrapper(async (req: Request, res: Response) => {
    const play = await Play.getPlayById(+req.params.playId);
  
    if (!req.file) {
      throw new BadRequestErr('تصویری آپلود نشده است.');
    }
  
    const { url, width, height, alt } = await PlayReview.uploadPlayReviewPic(+req.params.playId, {
      fileInfo: req.file,
      playTitle: play.title,
    });
  
    res.json({
      message: 'تصویر آپلود شد.',
      pic: {
        url,
        width,
        height,
        alt,
      },
    });
  }
  ),
];

export { controller as uploadReviewPic };
