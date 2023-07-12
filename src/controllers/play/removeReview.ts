import { Request, Response } from "express";
import { middlewareWrapper, reviewAdminAuth } from "../../middlewares";
import { prisma, passport, imageKit } from "../../config";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(reviewAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeReview };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  const play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
    select: { id: true }
  });

  if (play === null) {
    throw new NotFoundErr('نمایشی با این شناسه یافت نشد.');
  }

  const reviewPics = await prisma.play_pics.findMany({
    where: { play_id: play.id },
    select: {
      url: true,
      fileId: true,
    }
  });

  for (let { fileId } of reviewPics) {
    await imageKit.deleteFile(fileId);
  }

  await prisma.play_pics.deleteMany({
    where: { play_id: play.id },
  });

  await prisma.play_reviews.delete({
    where: { play_id: play.id },
  });

  res.json({
    message: 'نقد نمایش حذف شد.',
  });
}
