import { Request, Response } from 'express';
import { middlewareWrapper, playAdminAuth } from '../../middlewares';
import { prisma, passport, imageKit } from '../../config';
import { BadRequestErr, NotFoundErr } from '../../helpers/errors';

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeAllPlayPics };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const picsInfo = await prisma.play_pics.findMany({
    where: {
      play_id: +req.params.playId,
    },
    select: {
      fileId: true,
    },
  });

  if (picsInfo.length === 0) {
    throw new NotFoundErr('نمایشی با این شناسه پیدا نشد.');
  }

  for (let { fileId } of picsInfo) {
    await imageKit.deleteFile(fileId);
  }

  await prisma.play_pics.deleteMany({
    where: { play_id: +req.params.playId },
  });

  res.json({
    message: 'تصاویر حذف شدند.',
  });
}
