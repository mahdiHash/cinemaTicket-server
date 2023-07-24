import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth } from "../../middlewares";
import { prisma, passport, imageKit } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removePlay };

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

  const playReviewPics = await prisma.play_pics.findMany({
    where: {
      play_id: play.id,
      position: 'review',
    },
    select: {
      url: true,
      fileId: true,
    }
  });

  for (let { fileId } of playReviewPics) {
    await imageKit.deleteFile(fileId);
  }

  await prisma.comments.deleteMany({
    where: {
      record_id: play.id,
      type: 'play',
    }
  });

  await prisma.plays.delete({
    where: { id: play.id },
  });

  res.json({
    message: 'نمایش حذف شد.',
  });
}
