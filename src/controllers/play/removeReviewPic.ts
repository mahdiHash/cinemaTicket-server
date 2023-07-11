import { Request, Response } from 'express';
import { middlewareWrapper, reviewAdminAuth } from '../../middlewares';
import { prisma, passport, imageKit } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeReviewPic };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: { id: true },
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  const reviewPic = await prisma.play_pics.findFirst({
    where: {
      play_id: play.id,
      url: `/${req.params.folder}/${req.params.fileName}`,
      position: 'review',
    },
    select: {
      url: true,
      fileId: true,
    },
  });

  if (reviewPic === null) {
    throw new NotFoundErr('تصویر یافت نشد.');
  }

  await imageKit.deleteFile(reviewPic.fileId);
  await prisma.play_pics.delete({
    where: { url: reviewPic.url },
  });

  res.json({
    message: 'تصویر حذف شد.',
  });
}
