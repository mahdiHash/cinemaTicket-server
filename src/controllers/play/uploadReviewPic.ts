import { Request, Response } from 'express';
import { middlewareWrapper, reviewAdminAuth, checkRouteParamType } from '../../middlewares';
import { passport, prisma, imageKit, storeImgLocally } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { PlayService } from '../../services';

const Play = new PlayService();
const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(checkRouteParamType({ playId: 'number' })),

  storeImgLocally.single('img'),

  middlewareWrapper(middleware),
];

export { controller as uploadReviewPic };

async function middleware(req: Request, res: Response) {
  const play = await Play.getPlayById(+req.params.playId);

  if (!req.file) {
    throw new BadRequestErr('تصویری آپلود نشده است.');
  }

  const { url, width, height, alt } = await Play.uploadPlayReviewPic(+req.params.playId, {
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
