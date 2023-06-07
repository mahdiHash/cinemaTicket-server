import { Request, Response } from 'express';
import { prisma, passport, imageKit } from '../../config';
import { BadRequestErr, ForbiddenErr } from '../../helpers/errors';
import { playAdminAuth, middlewareWrapper } from '../../middlewares';

const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  middlewareWrapper(middleware),
];

export { controller as removeCeleb };

async function middleware(req: Request, res: Response) {
  if (!Number.isFinite(+req.params.id)) {
    throw new BadRequestErr('پارامتر id باید یک عدد باشد.');
  }

  let celebMovie = await prisma.play_celebrities.findFirst({
    where: { celebrity_Id: +req.params.id },
  });

  if (celebMovie) {
    throw new ForbiddenErr('این فرد در یک نمایش ثبت شده است. ابتدا آن نمایش را حذف کنید.');
  }

  let celebPics = await prisma.celebrity_pics.findMany({
    where: { celebrity_id: +req.params.id },
  });

  await Promise.all(celebPics.map(({ url, fileId }) => {
    return imageKit.deleteFile(fileId)
      .then(() => prisma.celebrity_pics.delete({ where: { url } }));
  }))
  await prisma.celebrities.delete({ where: { id: +req.params.id }});

  res.json({
    message: "پروفایل هنرمند حذف شد."
  });
}
