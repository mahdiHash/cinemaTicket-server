import { Request, Response } from "express";
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from "../../middlewares";
import { passport } from "../../config";
import { PlayService } from "../../services";

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number'})),

  middlewareWrapper(async (req: Request, res: Response) => {
    await Play.removePlayReviewById(+req.params.playId);
  
    res.json({
      message: 'نقد نمایش حذف شد.',
    });
  }
  ),
];

export { controller as removeReview };
