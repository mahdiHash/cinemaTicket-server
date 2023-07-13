import { Request, Response } from "express";
import { middlewareWrapper, playAdminAuth } from "../../middlewares";
import { BadRequestErr, NotFoundErr } from "../../helpers/errors";
import { passport, prisma, imageKit } from "../../config";

const controller = [
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeCoverPic };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.playId)) {
    throw new BadRequestErr('شناسه نمایش معتبر نیست.');
  }

  let play = await prisma.plays.findUnique({
    where: { id: +req.params.playId },
  });

  if (play === null) {
    throw new NotFoundErr('نمایش پیدا نشد.');
  }

  if (play.cover_url === null) {
    throw new BadRequestErr('نمایش عکس ندارد.');
  }
  else {
    await imageKit.deleteFile(play.cover_fileId as string);
  }

  await prisma.plays.update({
    where: { id: +req.params.playId },
    data: {
      cover_url: null,
      cover_fileId: null,
    }
  });

  res.json({
    message: 'عکس نمایش حذف شد.',
  });
}
