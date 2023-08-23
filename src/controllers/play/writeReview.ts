import { Request, Response } from 'express';
import { writeReviewInpValidator } from '../../validation/inputValidators';
import { passport } from '../../config';
import { admins } from '@prisma/client';
import {
  middlewareWrapper,
  reviewAdminAuth,
  storeValidatedInputs,
  checkRouteParamType,
} from '../../middlewares';
import { PlayReviewService } from '../../services/play.review.service';

const PlayReview = new PlayReviewService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  middlewareWrapper(storeValidatedInputs(writeReviewInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const reqAdminObj = req.user as admins;
  
    const review = await PlayReview.writePlayReview(
      +req.params.playId,
      res.locals.validBody.content,
      reqAdminObj.id
    );
  
    res.json({
      message: 'نقد نمایش ثبت شد.',
      review,
    });
  }
  ),
];

export { controller as writeReview };
