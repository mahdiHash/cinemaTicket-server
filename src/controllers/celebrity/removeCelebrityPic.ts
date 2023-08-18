import { Request, Response } from 'express';
import { passport } from '../../config';
import { NotFoundErr } from '../../helpers/errors';
import { playAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityService } from '../../services';

const Celeb = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  middlewareWrapper(async (req: Request, res: Response) => {
    let celeb = await Celeb.getCelebById(+req.params.id);

    if (!celeb) {
      throw new NotFoundErr('فرد مورد نظر پیدا نشد.');
    }

    await Celeb.removeCelebPicByUrl(`/${req.params.folder}/${req.params.fileName}`);

    res.json({
      message: 'تصویر هنرمند حذف شد.',
    });
  }),
];

export { controller as removeCelebrityPics };
