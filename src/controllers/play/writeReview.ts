import { Request, Response } from 'express';
import { writeReviewInpValidator } from '../../validation/inputValidators';
import { passport } from '../../config';
import { admins } from '@prisma/client';
import { middlewareWrapper, reviewAdminAuth, storeValidatedInputs, checkRouteParamType } from '../../middlewares';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number'})),

  middlewareWrapper(storeValidatedInputs(writeReviewInpValidator)),

  middlewareWrapper(middleware),
];

export { controller as writeReview };

async function middleware(req: Request, res: Response) {
  const reqAdminObj = req.user as admins;

  const review = await Play.writePlayReviewById(+req.params.playId, {
    text: res.locals.validBody.content,
    writer_id: reqAdminObj.id,
  });

  res.json({
    message: 'نقد نمایش ثبت شد.',
    review,
  });
}
