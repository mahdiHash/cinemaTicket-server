import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth } from "../../middlewares";
import { passport, prisma, imageKit } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removePlayPic };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: {
      id: true,
    }
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  let playPic = await prisma.play_pics.findFirst({
    where: { url: `/${req.params.folder}/${req.params.fileName}` },
  });

  if (playPic === null) {
    throw new NotFoundErr('عکسی با این آدرس یافت نشد.');
  }

  await imageKit.deleteFile(playPic.fileId);
  await prisma.play_pics.delete({
    where: { url: playPic.url },
  });

  res.json({
    message: 'تصویر حذف شد.',
  });
}
