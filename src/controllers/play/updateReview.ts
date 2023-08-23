import { Request, Response } from 'express';
import { writeReviewInpValidator } from '../../validation/inputValidators';
import { passport } from '../../config';
import { ForbiddenErr } from '../../helpers/errors';
import { unescape } from '../../helpers';
import { admins } from '@prisma/client';
import { middlewareWrapper, reviewAdminAuth, storeValidatedInputs, checkRouteParamType } from '../../middlewares';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(storeValidatedInputs(writeReviewInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;
    const review = await PlayReview.getPlayReview(+req.params.playId);
  
    // only review writer and super admins can edit the review
    if (reqAdminObj.access_level === 'review' && reqAdminObj.id !== review.writer!.id) {
      throw new ForbiddenErr('تنها نویسنده نقد می‌تواند آن را تغییر دهد.');
    }
  
    const upReview = await PlayReview.updatePlayReview(+req.params.playId, res.locals.validBody.content);
  
    res.json({
      message: 'نقد نمایش آپدیت شد.',
      review: {
        ...upReview,
        text: unescape(upReview.text),
      },
    });
  }
  ),
];

export { controller as updateReview };
