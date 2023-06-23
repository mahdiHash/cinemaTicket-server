import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth } from "../../middlewares";
import { passport, prisma, imageKit } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removePLayTrailer };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: {
      trailer_fileId: true,
      trailer_url: true,
    }
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  if (play.trailer_url === null) {
    throw new BadRequestErr('برای نمایش تریلری آپلود نشده است.');
  }

  await imageKit.deleteFile(play.trailer_fileId as string);
  await prisma.plays.update({
    where: { id: +req.params.playId },
    data: {
      trailer_fileId: null,
      trailer_url: null,
    }
  });

  res.json({
    message: 'تریلر حذف شد.',
  });
}
