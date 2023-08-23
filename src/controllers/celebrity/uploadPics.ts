import { Request, Response } from 'express';
import { passport, storeImgLocally } from '../../config';
import { BadRequestErr } from '../../helpers/errors';
import { playAdminAuth, middlewareWrapper, checkRouteParamType } from '../../middlewares';
import { CelebrityPicsService } from '../../services/celebrity.pics.service';

const CelebPics = new CelebrityPicsService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(checkRouteParamType({ id: 'number' })),

  storeImgLocally.array('imgs'),

  middlewareWrapper(middleware),
];

export { controller as uploadPics };

async function middleware(req: Request, res: Response) {
  if (!req.files) {
    throw new BadRequestErr('عکسی آپلود نشده است');
  }

  const imgs = await CelebPics.uploadCelebPics(+req.params.id, req.files as Express.Multer.File[]);

  res.json({
    imgs: imgs.map((img) => {
      const { fileId, ...imgInfo} = img;
      return imgInfo;
    }),
    message: 'تصاویر هنرمند آپلود شدند.',
  });
}
